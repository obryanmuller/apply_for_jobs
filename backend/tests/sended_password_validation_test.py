import unittest

from sended_password_validation import validate_password


class TestValidatePassword(unittest.TestCase):
    def test_valid_password(self):
        self.assertTrue(validate_password(True, True, True, 8, "abc123!@#"))

    def test_missing_letter(self):
        self.assertFalse(validate_password(True, True, True, 8, "123!@#"))

    def test_missing_digit(self):
        self.assertFalse(validate_password(True, True, True, 8, "abc!@#"))

    def test_missing_punctuation(self):
        self.assertFalse(validate_password(True, True, True, 8, "abc123"))

    def test_password_too_short(self):
        self.assertFalse(validate_password(True, True, True, 8, "a1!"))

    def test_only_letters(self):
        self.assertFalse(validate_password(True, True, True, 8, "abcdefg"))

    def test_only_digits(self):
        self.assertFalse(validate_password(True, True, True, 8, "1234567"))

    def test_only_punctuation(self):
        self.assertFalse(validate_password(
            True, True, True, 8, "!@#$%^&*()_+"))


if __name__ == '__main__':
    unittest.main()
