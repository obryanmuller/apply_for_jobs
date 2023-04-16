import unittest
from typing import List
import random_pass_generator


class TestGenerateRandomPassword(unittest.TestCase):

    def test_length(self):
        length = 10
        password = random_pass_generator.generate(True, True, True, length)
        self.assertEqual(len(password), length)

    def test_characters(self):
        length = 10
        password = random_pass_generator.generate(True, True, True, length)
        allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[]|\\:;"<>,.?/~`'
        for char in password:
            self.assertIn(char, allowed_chars)

    def test_alphabetic(self):
        length = 10
        password = random_pass_generator.generate(True, False, False, length)
        for char in password:
            self.assertTrue(char.isalpha())

    def test_numbers(self):
        length = 10
        password = random_pass_generator.generate(False, True, False, length)
        for char in password:
            self.assertTrue(char.isdigit())

    def test_punctuation(self):
        length = 10
        password = random_pass_generator.generate(False, False, False, length)
        allowed_punctuation = '!@#$%^&*()_+-={}[]|\\:;"<>,.?/~`'
        for char in password:
            self.assertIn(char, allowed_punctuation)


if __name__ == '__main__':
    unittest.main()
