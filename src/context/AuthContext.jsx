import { createContext, useContext, useState, useCallback } from 'react';
import { mockUsers, mockSurveys, mockTransactions } from '../data/mock';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [surveys, setSurveys] = useState(mockSurveys);
  const [transactions, setTransactions] = useState(mockTransactions);

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
