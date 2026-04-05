import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [surveyResponses, setSurveyResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch profile data (with retry for new signups where trigger may not have run yet)
  const fetchProfile = useCallback(async (userId, retries = 3) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setProfile(data);
      return data;
    }
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 1000));
      return fetchProfile(userId, retries - 1);
    }
    return null;
  }, []);

  // Fetch all surveys
  const fetchSurveys = useCallback(async () => {
    const { data } = await supabase.from('surveys').select('*').order('created_at', { ascending: false });
    if (data) setSurveys(data);
  }, []);

  // Fetch user transactions
  const fetchTransactions = useCallback(async (userId) => {
    const { data } = await supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) setTransactions(data);
  }, []);

  // Fetch user's survey responses
  const fetchResponses = useCallback(async (userId) => {
    const { data } = await supabase.from('survey_responses').select('*').eq('respondent_id', userId);
    if (data) setSurveyResponses(data);
  }, []);

  // Initialize auth state
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await Promise.all([
          fetchProfile(session.user.id),
          fetchTransactions(session.user.id),
          fetchResponses(session.user.id),
        ]);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await Promise.all([
          fetchProfile(session.user.id),
          fetchTransactions(session.user.id),
          fetchResponses(session.user.id),
        ]);
      } else {
        setProfile(null);
        setTransactions([]);
        setSurveyResponses([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, fetchTransactions, fetchResponses]);

  // Fetch surveys on mount (available to everyone including guests)
  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  // === AUTH ===
  const login = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signup = useCallback(async ({ email, password, display_name }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name } },
    });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setTransactions([]);
    setSurveyResponses([]);
  }, []);

  // === PROFILE ===
  const updateProfile = useCallback(async (updates) => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (!error) setProfile((prev) => prev ? { ...prev, ...updates } : null);
  }, [user]);

  // === CREDITS ===
  const addCredits = useCallback(async (amount, description, type = 'survey_completed', referenceId = null) => {
    if (!user) return;
    // Update balance
    const newBalance = (profile?.credit_balance ?? 0) + amount;
    await supabase.from('profiles').update({ credit_balance: newBalance }).eq('id', user.id);
    setProfile((prev) => prev ? { ...prev, credit_balance: newBalance } : null);
    // Log transaction
    const txn = { user_id: user.id, type, amount, description, reference_id: referenceId };
    const { data } = await supabase.from('transactions').insert(txn).select().single();
    if (data) setTransactions((prev) => [data, ...prev]);
  }, [user, profile?.credit_balance]);

  const spendCredits = useCallback(async (amount, description, type = 'survey_published', referenceId = null) => {
    if (!user) return;
    const newBalance = (profile?.credit_balance ?? 0) - amount;
    await supabase.from('profiles').update({ credit_balance: newBalance }).eq('id', user.id);
    setProfile((prev) => prev ? { ...prev, credit_balance: newBalance } : null);
    const txn = { user_id: user.id, type, amount: -amount, description, reference_id: referenceId };
    const { data } = await supabase.from('transactions').insert(txn).select().single();
    if (data) setTransactions((prev) => [data, ...prev]);
  }, [user, profile?.credit_balance]);

  // === SURVEYS ===
  const addSurvey = useCallback(async (surveyData) => {
    if (!user) return null;
    const survey = {
      creator_id: user.id,
      title: surveyData.title,
      description: surveyData.description,
      survey_type: surveyData.survey_type,
      survey_url: surveyData.survey_url || null,
      questions: surveyData.questions || [],
      estimated_minutes: surveyData.estimated_minutes,
      topics: surveyData.topics,
      responses_needed: surveyData.responses_needed,
      responses_collected: 0,
      targeting_enabled: surveyData.targeting_enabled,
      target_age_range: surveyData.target_age_range || null,
      target_country: surveyData.target_country || null,
      target_education: surveyData.target_education || null,
      target_language: surveyData.target_language || null,
      target_custom: surveyData.target_custom || null,
      credit_cost_per_response: surveyData.credit_cost_per_response,
      total_credits_spent: surveyData.total_credits_spent,
      status: 'active',
    };
    const { data, error } = await supabase.from('surveys').insert(survey).select().single();
    if (data) setSurveys((prev) => [data, ...prev]);
    return data;
  }, [user]);

  const completeSurvey = useCallback(async (surveyId) => {
    const survey = surveys.find((s) => s.id === surveyId);
    if (!survey) return;
    const newCount = survey.responses_collected + 1;
    await supabase.from('surveys').update({ responses_collected: newCount }).eq('id', surveyId);
    setSurveys((prev) => prev.map((s) => s.id === surveyId ? { ...s, responses_collected: newCount } : s));
  }, [surveys]);

  // === RESPONSES ===
  const hasCompletedSurvey = useCallback((surveyId) => {
    return surveyResponses.some((r) => r.survey_id === surveyId);
  }, [surveyResponses]);

  const submitSurveyResponse = useCallback(async (surveyId, answers) => {
    if (!user) return false;
    const survey = surveys.find((s) => s.id === surveyId);
    if (!survey) return false;
    if (hasCompletedSurvey(surveyId)) return false;

    // Insert response
    const { data: response, error } = await supabase.from('survey_responses').insert({
      survey_id: surveyId,
      respondent_id: user.id,
      answers,
    }).select().single();

    if (error) return false;
    setSurveyResponses((prev) => [...prev, response]);

    // Increment responses collected
    const newCount = survey.responses_collected + 1;
    await supabase.from('surveys').update({ responses_collected: newCount }).eq('id', surveyId);
    setSurveys((prev) => prev.map((s) => s.id === surveyId ? { ...s, responses_collected: newCount } : s));

    // Award credits
    const credits = survey.estimated_minutes;
    await addCredits(credits, `Completed: ${survey.title}`, 'survey_completed', surveyId);

    return true;
  }, [user, surveys, hasCompletedSurvey, addCredits]);

  const getSurveyResponses = useCallback(async (surveyId) => {
    const { data } = await supabase.from('survey_responses').select('*').eq('survey_id', surveyId);
    return data || [];
  }, []);

  // Computed stats
  const totalEarned = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + Number(t.amount), 0);
  const totalSpent = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
  const surveysTaken = transactions.filter((t) => t.type === 'survey_completed').length;
  const surveysCreated = surveys.filter((s) => s.creator_id === user?.id).length;

  // Merge profile into a user-like object for backward compatibility
  const userObj = profile ? {
    ...profile,
    id: profile.id,
    email: profile.email || user?.email,
  } : null;

  return (
    <AuthContext.Provider
      value={{
        user: userObj,
        authUser: user,
        surveys,
        transactions,
        totalEarned,
        totalSpent,
        surveysTaken,
        surveysCreated,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        addCredits,
        spendCredits,
        addSurvey,
        completeSurvey,
        hasCompletedSurvey,
        submitSurveyResponse,
        getSurveyResponses,
        fetchSurveys,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
