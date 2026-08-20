"""Seed global DSA questions with test cases and starter code templates."""
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.questions.models import Category, CodeTemplate, Question, TestCase


class Command(BaseCommand):
    help = (
        "Seed the global 'DSA' category with standard questions "
        "(Two Sum, Reverse String, Valid Anagram) including test cases "
        "and starter code templates for Python, Java, C++, and JavaScript."
    )

    QUESTIONS = [
        {
            "title": "Two Sum",
            "prompt": (
                "Given an array of integers nums and an integer target, return indices of "
                "the two numbers such that they add up to target.\n\n"
                "You may assume that each input would have exactly one solution, and you "
                "may not use the same element twice. You can return the answer in any order."
            ),
            "constraints": (
                "2 <= nums.length <= 10^4\n"
                "-10^9 <= nums[i] <= 10^9\n"
                "-10^9 <= target <= 10^9\n"
                "Only one valid answer exists."
            ),
            "difficulty": "easy",
            "test_cases": [
                {
                    "input_data": "[2, 7, 11, 15], target = 9",
                    "expected_output": "[0, 1]",
                    "is_hidden": False,
                    "weight": 1,
                },
                {
                    "input_data": "[3, 2, 4], target = 6",
                    "expected_output": "[1, 2]",
                    "is_hidden": False,
                    "weight": 2,
                },
                {
                    "input_data": "[3, 3], target = 6",
                    "expected_output": "[0, 1]",
                    "is_hidden": True,
                    "weight": 3,
                },
            ],
            "starter_code": {
                "python": """from typing import List


class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        pass
""",
                "java": """class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[]{};
    }
}
""",
                "cpp": """#include <vector>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        return {};
    }
};
""",
                "javascript": """/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    return [];
};
""",
            },
        },
        {
            "title": "Reverse String",
            "prompt": (
                "Write a function that reverses a string. The input string is given as "
                "an array of characters s.\n\n"
                "You must do this by modifying the input array in-place with O(1) extra memory."
            ),
            "constraints": (
                "1 <= s.length <= 10^5\n"
                "s[i] is a printable ascii character."
            ),
            "difficulty": "easy",
            "test_cases": [
                {
                    "input_data": '["h", "e", "l", "l", "o"]',
                    "expected_output": '["o", "l", "l", "e", "h"]',
                    "is_hidden": False,
                    "weight": 1,
                },
                {
                    "input_data": '["H", "a", "n", "n", "a", "h"]',
                    "expected_output": '["h", "a", "n", "n", "a", "H"]',
                    "is_hidden": False,
                    "weight": 2,
                },
                {
                    "input_data": '["a"]',
                    "expected_output": '["a"]',
                    "is_hidden": True,
                    "weight": 3,
                },
            ],
            "starter_code": {
                "python": """from typing import List


class Solution:
    def reverseString(self, s: List[str]) -> None:
        pass
""",
                "java": """class Solution {
    public void reverseString(char[] s) {
    }
}
""",
                "cpp": """#include <vector>

class Solution {
public:
    void reverseString(std::vector<char>& s) {
    }
};
""",
                "javascript": """/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
};
""",
            },
        },
        {
            "title": "Valid Anagram",
            "prompt": (
                "Given two strings s and t, return true if t is an anagram of s, and false otherwise. "
                "An anagram is a word or phrase formed by rearranging the letters of a different word "
                "or phrase, typically using all the original letters exactly once."
            ),
            "constraints": (
                "1 <= s.length, t.length <= 5 * 10^4\n"
                "s and t consist of lowercase English letters."
            ),
            "difficulty": "easy",
            "test_cases": [
                {
                    "input_data": "s = anagram, t = nagaram",
                    "expected_output": "true",
                    "is_hidden": False,
                    "weight": 1,
                },
                {
                    "input_data": "s = rat, t = car",
                    "expected_output": "false",
                    "is_hidden": False,
                    "weight": 2,
                },
                {
                    "input_data": "s = a, t = ab",
                    "expected_output": "false",
                    "is_hidden": True,
                    "weight": 3,
                },
            ],
            "starter_code": {
                "python": """class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        pass
""",
                "java": """class Solution {
    public boolean isAnagram(String s, String t) {
        return false;
    }
}
""",
                "cpp": """#include <string>

class Solution {
public:
    bool isAnagram(std::string s, std::string t) {
        return false;
    }
};
""",
                "javascript": """function isAnagram(s, t) {
    return false;
}
""",
            },
        },
    ]

    @transaction.atomic
    def handle(self, *args, **options):
        category, _ = Category.objects.get_or_create(
            name="DSA",
            company=None,
            is_global=True,
        )
        self.stdout.write(f"Category ready: {category.name} (global={category.is_global})")

        for data in self.QUESTIONS:
            question, _ = Question.objects.update_or_create(
                company=None,
                is_global=True,
                title=data["title"],
                defaults={
                    "category": category,
                    "prompt": data["prompt"],
                    "constraints": data["constraints"],
                    "difficulty": data["difficulty"],
                    "is_active": True,
                },
            )

            for tc in data["test_cases"]:
                TestCase.objects.update_or_create(
                    question=question,
                    input_data=tc["input_data"],
                    expected_output=tc["expected_output"],
                    defaults={
                        "is_hidden": tc["is_hidden"],
                        "weight": tc["weight"],
                    },
                )

            for language, starter_code in data["starter_code"].items():
                CodeTemplate.objects.update_or_create(
                    question=question,
                    language=language,
                    defaults={"starter_code": starter_code},
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f"Seeded '{question.title}' (difficulty={question.difficulty}, "
                    f"time_limit={question.time_limit_seconds}s, "
                    f"{question.test_cases.count()} test cases, "
                    f"{question.code_templates.count()} templates)"
                )
            )

        self.stdout.write(self.style.SUCCESS("DSA questions seeded successfully."))