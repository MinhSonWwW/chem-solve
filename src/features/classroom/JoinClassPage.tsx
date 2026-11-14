import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StudentClassCard, useStudentMembership } from './StudentClassCard';

/** /join?code=XXXXXX — link a teacher shares (e.g. on Zalo) so students land on a pre-filled form. */
export const JoinClassPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const membership = useStudentMembership();
  return (
    <div className="max-w-md mx-auto py-4 space-y-3">
      <StudentClassCard initialCode={(params.get('code') || '').toUpperCase()} />
      {membership && (
        <button
          onClick={() => navigate('/home')}
          className="w-full h-12 rounded-2xl bg-[var(--subject-fill)] text-white font-black shadow-[0_4px_0_0_var(--subject-edge)] cursor-pointer"
        >
          Xem bài được giao
        </button>
      )}
    </div>
  );
};
