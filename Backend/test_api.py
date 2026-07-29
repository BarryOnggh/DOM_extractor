"""Backend schema tests that do not call external AI or speech services."""

import importlib.util
import sys
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

PYDANTIC_AVAILABLE = importlib.util.find_spec("pydantic") is not None


@unittest.skipUnless(PYDANTIC_AVAILABLE, "Install Backend/requirements.txt to run schema tests.")
class SchemaTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from schemas import NavigationResponse, SuggestedAction

        cls.NavigationResponse = NavigationResponse
        cls.SuggestedAction = SuggestedAction

    def test_navigation_response_contract(self):
        response = self.NavigationResponse(
            element_id="search",
            action_type="type",
            type_value="course information",
            explanation="Enter a non-sensitive search phrase.",
        )
        self.assertEqual(response.action_type, "type")

    def test_suggestion_confidence_is_bounded(self):
        from pydantic import ValidationError

        with self.assertRaises(ValidationError):
            self.SuggestedAction(
                id="invalid",
                label="Invalid confidence",
                intent="Explain this page",
                targetType="explanation",
                confidence=1.5,
            )

    def test_sensitive_navigation_action_is_represented_as_guidance(self):
        response = self.NavigationResponse(
            element_id=None,
            action_type="fail",
            type_value=None,
            explanation="Complete sensitive information yourself.",
        )
        self.assertIsNone(response.element_id)


if __name__ == "__main__":
    unittest.main()
