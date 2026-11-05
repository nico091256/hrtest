import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateTestAnswers,
  filterSubmissions,
  formatDuration,
  getQualificationTier,
  validateCandidateInfo,
} from './scoring';
import { Question, Submission } from '../types';

test('getQualificationTier maps exact Discover Invest 0-100 boundaries', () => {
  // 0-49: not_qualified
  assert.equal(getQualificationTier(0), 'not_qualified');
  assert.equal(getQualificationTier(40), 'not_qualified');
  assert.equal(getQualificationTier(49), 'not_qualified');

  // 50-64: needs_development
  assert.equal(getQualificationTier(50), 'needs_development');
  assert.equal(getQualificationTier(60), 'needs_development');
  assert.equal(getQualificationTier(64), 'needs_development');

  // 65-79: qualified
  assert.equal(getQualificationTier(65), 'qualified');
  assert.equal(getQualificationTier(70), 'qualified');
  assert.equal(getQualificationTier(79), 'qualified');

  // 80-89: high_level
  assert.equal(getQualificationTier(80), 'high_level');
  assert.equal(getQualificationTier(89), 'high_level');

  // 90-100: talent_pool
  assert.equal(getQualificationTier(90), 'talent_pool');
  assert.equal(getQualificationTier(100), 'talent_pool');
});

test('evaluateTestAnswers calculates 10 questions x 10 points = 100 max score', () => {
  const mockQuestions: Question[] = Array.from({ length: 10 }, (_, i) => ({
    id: `q-${i + 1}`,
    orderIndex: i + 1,
    level: 'basic',
    categoryUz: 'Test',
    categoryRu: 'Тест',
    questionUz: `Savol ${i + 1}`,
    questionRu: `Вопрос ${i + 1}`,
    optionsUz: { A: '1', B: '2', C: '3', D: '4' },
    optionsRu: { A: '1', B: '2', C: '3', D: '4' },
    correctOption: 'B',
    normativeRefUz: 'SHNK',
    normativeRefRu: 'СНиП',
  }));

  // 8 correct out of 10 -> 80 points -> high_level
  const answers: Record<string, 'A' | 'B' | 'C' | 'D'> = {
    'q-1': 'B',
    'q-2': 'B',
    'q-3': 'B',
    'q-4': 'B',
    'q-5': 'B',
    'q-6': 'B',
    'q-7': 'B',
    'q-8': 'B',
    'q-9': 'A',
    'q-10': 'D',
  };

  const result = evaluateTestAnswers(mockQuestions, answers);
  assert.equal(result.correctCount, 8);
  assert.equal(result.score, 80);
  assert.equal(result.pointsPerQuestion, 10);
  assert.equal(result.qualificationTier, 'high_level');
  assert.equal(result.evaluations.length, 10);
  assert.equal(result.evaluations[0].isCorrect, true);
  assert.equal(result.evaluations[8].isCorrect, false);
});

test('validateCandidateInfo rejects incomplete fields and accepts valid candidate', () => {
  assert.equal(
    validateCandidateInfo({
      fullName: 'A',
      position: 'Usta',
      siteObject: 'Boulevard',
      phone: '+998901234567',
      level: 'basic',
    }).valid,
    false
  );

  assert.equal(
    validateCandidateInfo({
      fullName: 'Rustamov Sardorbek',
      position: 'Monolit-beton ustasi',
      siteObject: 'Gardens Residence',
      phone: '+998 90 123 45 67',
      level: 'intermediate',
    }).valid,
    true
  );
});

test('filterSubmissions filters by level, tier, and search query', () => {
  const sample: Submission[] = [
    {
      id: '1',
      candidateName: 'Aliyev Jasur',
      position: 'Beton ustasi',
      siteObject: 'Tashkent City',
      phone: '998901112233',
      level: 'basic',
      answers: {},
      score: 90,
      correctCount: 9,
      totalQuestions: 10,
      pointsPerQuestion: 10,
      durationSeconds: 310,
      qualificationTier: 'talent_pool',
      submittedAt: new Date().toISOString(),
    },
    {
      id: '2',
      candidateName: 'Karimov Bobur',
      position: 'Bosh prorab',
      siteObject: 'Mirabad Avenue',
      phone: '998904445566',
      level: 'advanced',
      answers: {},
      score: 60,
      correctCount: 6,
      totalQuestions: 10,
      pointsPerQuestion: 10,
      durationSeconds: 420,
      qualificationTier: 'needs_development',
      submittedAt: new Date().toISOString(),
    },
  ];

  assert.equal(filterSubmissions(sample, { levelFilter: 'basic' }).length, 1);
  assert.equal(filterSubmissions(sample, { tierFilter: 'needs_development' }).length, 1);
  assert.equal(filterSubmissions(sample, { searchQuery: 'mirabad' }).length, 1);
  assert.equal(formatDuration(125), '02:05');
});
