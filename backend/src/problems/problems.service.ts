import { Injectable } from '@nestjs/common';
import { SubmitSolutionDto } from './dto/submit-solution.dto';

// VM2 동적 import
const vm2 = require('vm2');
const VM = vm2.VM;

export interface Problem {
  date: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starterCode: string;
  solution: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
}

interface Submission {
  date: string;
  solved: boolean;
  solvedAt?: string;
}

@Injectable()
export class ProblemsService {
  private problemTemplates: Omit<Problem, 'date'>[] = [
    {
      title: '두 수의 합',
      description: `두 개의 숫자를 입력받아 그 합을 반환하는 함수를 작성하세요.

예시:
- 입력: 5, 3
- 출력: 8

함수명은 addTwoNumbers로 작성해주세요.`,
      difficulty: 'easy',
      starterCode: `function addTwoNumbers(a, b) {
  // 여기에 코드를 작성하세요
}`,
      solution: `function addTwoNumbers(a, b) {
  return a + b;
}`,
      testCases: [
        { input: '5, 3', expectedOutput: '8' },
        { input: '10, 20', expectedOutput: '30' },
        { input: '-5, 5', expectedOutput: '0' },
      ],
    },
    {
      title: '배열의 최댓값 찾기',
      description: `숫자 배열을 입력받아 그 중 최댓값을 반환하는 함수를 작성하세요.

예시:
- 입력: [1, 5, 3, 9, 2]
- 출력: 9

함수명은 findMax로 작성해주세요.`,
      difficulty: 'medium',
      starterCode: `function findMax(arr) {
  // 여기에 코드를 작성하세요
}`,
      solution: `function findMax(arr) {
  return Math.max(...arr);
}`,
      testCases: [
        { input: '[1, 5, 3, 9, 2]', expectedOutput: '9' },
        { input: '[-1, -5, -3]', expectedOutput: '-1' },
        { input: '[10]', expectedOutput: '10' },
      ],
    },
    {
      title: '문자열 뒤집기',
      description: `문자열을 입력받아 뒤집은 문자열을 반환하는 함수를 작성하세요.

예시:
- 입력: "hello"
- 출력: "olleh"

함수명은 reverseString으로 작성해주세요.`,
      difficulty: 'easy',
      starterCode: `function reverseString(str) {
  // 여기에 코드를 작성하세요
}`,
      solution: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
      testCases: [
        { input: '"hello"', expectedOutput: '"olleh"' },
        { input: '"world"', expectedOutput: '"dlrow"' },
        { input: '""', expectedOutput: '""' },
      ],
    },
    {
      title: '팰린드롬 확인',
      description: `문자열이 팰린드롬인지 확인하는 함수를 작성하세요. 팰린드롬은 앞에서 읽으나 뒤에서 읽으나 같은 문자열을 의미합니다.

예시:
- 입력: "level"
- 출력: true

함수명은 isPalindrome으로 작성해주세요.`,
      difficulty: 'medium',
      starterCode: `function isPalindrome(str) {
  // 여기에 코드를 작성하세요
}`,
      solution: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
      testCases: [
        { input: '"level"', expectedOutput: 'true' },
        { input: '"hello"', expectedOutput: 'false' },
        { input: '"A man a plan a canal Panama"', expectedOutput: 'true' },
      ],
    },
    {
      title: '배열 중복 제거',
      description: `배열에서 중복된 요소를 제거하고 유일한 요소만 반환하는 함수를 작성하세요.

예시:
- 입력: [1, 2, 2, 3, 4, 4, 5]
- 출력: [1, 2, 3, 4, 5]

함수명은 removeDuplicates로 작성해주세요.`,
      difficulty: 'medium',
      starterCode: `function removeDuplicates(arr) {
  // 여기에 코드를 작성하세요
}`,
      solution: `function removeDuplicates(arr) {
  return [...new Set(arr)];
}`,
      testCases: [
        { input: '[1, 2, 2, 3, 4, 4, 5]', expectedOutput: '[1,2,3,4,5]' },
        { input: '["a", "b", "a", "c"]', expectedOutput: '["a","b","c"]' },
        { input: '[1]', expectedOutput: '[1]' },
      ],
    },
  ];

  private problems: Map<string, Problem> = new Map();
  private submissions: Map<string, Submission> = new Map();

  private getProblemForDate(date: string): Problem {
    if (!this.problems.has(date)) {
      // 날짜 기반으로 문제 선택 (일관성 있게)
      const dayIndex = Math.floor(
        (new Date(date).getTime() - new Date('2024-01-01').getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const templateIndex = dayIndex % this.problemTemplates.length;
      const template = this.problemTemplates[templateIndex];

      this.problems.set(date, {
        ...template,
        date,
      });
    }

    return this.problems.get(date)!;
  }

  getTodayProblem() {
    const today = this.getTodayDate();
    const problem = this.getProblemForDate(today);
    const submission = this.submissions.get(today);

    return {
      date: problem.date,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      solved: submission?.solved || false,
    };
  }

  getProblemByDate(date: string): Problem | null {
    const problem = this.getProblemForDate(date);

    // solution은 제거하고 반환
    const { solution, ...problemWithoutSolution } = problem;
    return problemWithoutSolution as Problem;
  }

  submitSolution(date: string, code: string) {
    const problem = this.getProblemForDate(date);
    
    try {
      // 코드 실행 환경 생성
      const testResults = this.runTests(code, problem.testCases, problem.solution);

      const allPassed = testResults.every((result) => result.passed);

      if (allPassed) {
        this.submissions.set(date, {
          date,
          solved: true,
          solvedAt: new Date().toISOString(),
        });
      }

      return {
        success: allPassed,
        message: allPassed
          ? '모든 테스트를 통과했습니다! 🎉'
          : '일부 테스트를 통과하지 못했습니다.',
        testResults,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `코드 실행 중 오류가 발생했습니다: ${error.message}`,
      };
    }
  }

  private runTests(
    userCode: string,
    testCases: Array<{ input: string; expectedOutput: string }>,
    solutionCode: string,
  ): Array<{ passed: boolean; input: string; expected: string; output: string }> {
    const results: Array<{ passed: boolean; input: string; expected: string; output: string }> = [];
    const funcMatch = userCode.match(/function\s+(\w+)\s*\(/);
    
    if (!funcMatch) {
      // 함수 정의가 없으면 모든 테스트 실패
      for (const testCase of testCases) {
        results.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          output: '함수 정의를 찾을 수 없습니다. function 함수명() 형식으로 작성해주세요.',
        });
      }
      return results;
    }

    const functionName = funcMatch[1];
    const vm = new VM({
      timeout: 1000,
      sandbox: {},
    });

    // 사용자 코드를 VM에 로드
    try {
      vm.run(userCode);
    } catch (error: any) {
      for (const testCase of testCases) {
        results.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          output: `코드 문법 오류: ${error.message}`,
        });
      }
      return results;
    }

    // 각 테스트 케이스 실행
    for (const testCase of testCases) {
      try {
        // 입력값 파싱
        const inputValues = this.parseInput(testCase.input);
        const expectedValue = this.parseValue(testCase.expectedOutput);

        // 함수 실행
        const result = vm.run(`
          ${functionName}(...${JSON.stringify(inputValues)})
        `);

        const passed = this.deepEqual(result, expectedValue);

        results.push({
          passed,
          input: testCase.input,
          expected: testCase.expectedOutput,
          output: String(result),
        });
      } catch (error: any) {
        results.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          output: `실행 오류: ${error.message}`,
        });
      }
    }

    return results;
  }

  private parseInput(input: string): any[] {
    try {
      // 쉼표로 구분된 값들을 파싱
      const values = input.split(',').map(v => v.trim());
      return values.map(v => {
        // 숫자로 변환 가능한지 확인
        if (!isNaN(Number(v))) {
          return Number(v);
        }
        // 배열인지 확인
        if (v.startsWith('[') && v.endsWith(']')) {
          return JSON.parse(v);
        }
        // 문자열
        return v;
      });
    } catch {
      return [input];
    }
  }

  private parseValue(value: string): any {
    try {
      // 숫자로 변환 가능한지 확인
      if (!isNaN(Number(value))) {
        return Number(value);
      }
      // JSON 파싱 시도
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  private deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object' && a !== null && b !== null) {
      if (Array.isArray(a) !== Array.isArray(b)) return false;
      const keys = Object.keys(a);
      if (keys.length !== Object.keys(b).length) return false;
      for (const key of keys) {
        if (!this.deepEqual(a[key], b[key])) return false;
      }
      return true;
    }
    return false;
  }

  private extractFunctionName(code: string): string {
    const match = code.match(/function\s+(\w+)\s*\(/);
    return match ? match[1] : 'unknown';
  }

  getHistory(): Array<{
    date: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    solved: boolean;
    solvedAt?: string;
  }> {
    const history: Array<{
      date: string;
      title: string;
      difficulty: 'easy' | 'medium' | 'hard';
      solved: boolean;
      solvedAt?: string;
    }> = [];
    const today = this.getTodayDate();
    
    // 최근 30일 문제 생성
    for (let i = 0; i < 30; i++) {
      const date = this.getDateString(
        new Date(new Date(today).getTime() - i * 24 * 60 * 60 * 1000),
      );
      const problem = this.getProblemForDate(date);
      const submission = this.submissions.get(date);
      
      history.push({
        date: problem.date,
        title: problem.title,
        difficulty: problem.difficulty,
        solved: submission?.solved || false,
        solvedAt: submission?.solvedAt,
      });
    }

    // 최신순으로 정렬
    return history.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  private getTodayDate(): string {
    return this.getDateString(new Date());
  }

  private getDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

