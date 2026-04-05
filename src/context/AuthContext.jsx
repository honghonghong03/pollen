import { createContext, useContext, useState, useCallback } from 'react';
import { mockUsers, mockSurveys, mockTransactions } from '../data/mock';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [surveys, setSurveys] = useState(mockSurveys);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [surveyResponses, setSurveyResponses] = useState([
    // Seed mock responses for s1 (Remote Work) so creator can see results
    { id: 'sr_m1', survey_id: 's1', user_id: 'u1', answers: { q1_1: '6-8 hours', q1_2: ['Social media', 'Notifications'], q1_3: 4, q1_4: 'Use a dedicated workspace and time-block your day.', q1_5: 'Yes' }, completed_at: '2026-04-04T11:00:00Z' },
    { id: 'sr_m2', survey_id: 's1', user_id: 'u3', answers: { q1_1: '4-6 hours', q1_2: ['Household chores', 'Social media', 'Snacking'], q1_3: 3, q1_4: 'Take regular breaks.', q1_5: 'No' }, completed_at: '2026-04-04T12:30:00Z' },
    { id: 'sr_m3', survey_id: 's1', user_id: 'mock1', answers: { q1_1: '8-10 hours', q1_2: ['Notifications', 'Family/roommates'], q1_3: 5, q1_4: '', q1_5: 'Yes' }, completed_at: '2026-04-04T14:00:00Z' },
    { id: 'sr_m4', survey_id: 's1', user_id: 'mock2', answers: { q1_1: '6-8 hours', q1_2: ['Social media'], q1_3: 4, q1_4: 'Pomodoro technique works great.', q1_5: 'Yes' }, completed_at: '2026-04-04T15:00:00Z' },
    { id: 'sr_m5', survey_id: 's1', user_id: 'mock3', answers: { q1_1: 'Less than 4', q1_2: ['TV/streaming', 'Social media', 'Snacking'], q1_3: 2, q1_4: 'Still figuring it out honestly.', q1_5: 'No' }, completed_at: '2026-04-04T16:00:00Z' },
    { id: 'sr_m6', survey_id: 's1', user_id: 'mock4', answers: { q1_1: '6-8 hours', q1_2: ['Notifications'], q1_3: 4, q1_4: 'Noise-cancelling headphones.', q1_5: 'Yes' }, completed_at: '2026-04-05T08:00:00Z' },
    { id: 'sr_m7', survey_id: 's1', user_id: 'mock5', answers: { q1_1: '4-6 hours', q1_2: ['Household chores', 'Family/roommates'], q1_3: 3, q1_4: '', q1_5: 'No' }, completed_at: '2026-04-05T09:00:00Z' },
    { id: 'sr_m8', survey_id: 's1', user_id: 'mock6', answers: { q1_1: 'More than 10', q1_2: ['Social media', 'Notifications', 'Snacking'], q1_3: 3, q1_4: 'Set clear start and end times.', q1_5: 'Yes' }, completed_at: '2026-04-05T10:00:00Z' },
  ]);

  const login = useCallback((email) => {
    const found = mockUsers.find((u) => u.email === email);
    if (found) {
      setUser({ ...found });
      return true;
    }
    return false;
  }, []);

  const signup = useCallback((data) => {
    const newUser = {
      id: 'u' + Date.now(),
      email: data.email,
      display_name: data.display_name,
      age_range: null,
      gender: null,
      country: null,
      languages: [],
      education_level: null,
      field_of_study: null,
      is_student: false,
      income_bracket: null,
      interests: [],
      trust_score: 3.0,
      credit_balance: 15,
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    setTransactions((prev) => [
      {
        id: 't' + Date.now(),
        user_id: newUser.id,
        type: 'starter_credits',
        amount: 15,
        description: 'Welcome to Pollen!',
        reference_id: null,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const addCredits = useCallback((amount, description, type = 'survey_completed', referenceId = null) => {
    setUser((prev) => prev ? { ...prev, credit_balance: prev.credit_balance + amount } : null);
    setTransactions((prev) => [
      {
        id: 't' + Date.now(),
        user_id: user?.id,
        type,
        amount,
        description,
        reference_id: referenceId,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, [user?.id]);

  const spendCredits = useCallback((amount, description, type = 'survey_published', referenceId = null) => {
    setUser((prev) => prev ? { ...prev, credit_balance: prev.credit_balance - amount } : null);
    setTransactions((prev) => [
      {
        id: 't' + Date.now(),
        user_id: user?.id,
        type,
        amount: -amount,
        description,
        reference_id: referenceId,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, [user?.id]);

  const addSurvey = useCallback((survey) => {
    setSurveys((prev) => [survey, ...prev]);
  }, []);

  const completeSurvey = useCallback((surveyId) => {
    setSurveys((prev) =>
      prev.map((s) =>
        s.id === surveyId
          ? { ...s, responses_collected: s.responses_collected + 1 }
          : s
      )
    );
  }, []);

  const hasCompletedSurvey = useCallback((surveyId) => {
    return surveyResponses.some((r) => r.survey_id === surveyId && r.user_id === user?.id);
  }, [surveyResponses, user?.id]);

  const submitSurveyResponse = useCallback((surveyId, answers) => {
    const survey = surveys.find((s) => s.id === surveyId);
    if (!survey || !user) return false;

    // Prevent double completion
    if (surveyResponses.some((r) => r.survey_id === surveyId && r.user_id === user.id)) {
      return false;
    }

    const response = {
      id: 'sr' + Date.now(),
      survey_id: surveyId,
      user_id: user.id,
      answers,
      completed_at: new Date().toISOString(),
    };

    setSurveyResponses((prev) => [...prev, response]);

    // Increment responses collected
    setSurveys((prev) =>
      prev.map((s) =>
        s.id === surveyId
          ? { ...s, responses_collected: s.responses_collected + 1 }
          : s
      )
    );

    // Award credits
    const credits = survey.estimated_minutes;
    setUser((prev) => prev ? { ...prev, credit_balance: prev.credit_balance + credits } : null);
    setTransactions((prev) => [
      {
        id: 't' + Date.now(),
        user_id: user.id,
        type: 'survey_completed',
        amount: credits,
        description: `Completed: ${survey.title}`,
        reference_id: surveyId,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    return true;
  }, [surveys, user, surveyResponses]);

  const userTransactions = transactions.filter((t) => t.user_id === user?.id);
  const totalEarned = userTransactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = userTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const surveysTaken = userTransactions.filter((t) => t.type === 'survey_completed').length;
  const surveysCreated = surveys.filter((s) => s.creator_id === user?.id).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        surveys,
        transactions: userTransactions,
        totalEarned,
        totalSpent,
        surveysTaken,
        surveysCreated,
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
        getSurveyResponses: (surveyId) => surveyResponses.filter((r) => r.survey_id === surveyId),
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
