export interface ICase {
  title: string;
  subTitle: string;
  description: string;
  slug: string;
}

export interface IEmoji {
  name: string;
  symbol: string;
  text: string;
}

export interface ResCalculateDiagonalSum {
  data: {
    matrix: number[][];
    sum: number;
  }
}

export interface ResFindCommonSlot {
  data: {
    common?: number[];
    message?: string;
  }
}

export interface ResIsCircularPalindrome {
  data: {
    word: string;
    rotated_word: string;
    is_palindrome: boolean;
  }
}

export interface ResSelfNumbers {
  data: {
    sum: number;
  }
}


export interface ResSecretMessage {
  data: {
    message: string;
    result: string;
  }
}

export interface ResError {
  error: string;
}
