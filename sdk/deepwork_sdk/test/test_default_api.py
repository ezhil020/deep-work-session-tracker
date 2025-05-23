# coding: utf-8

"""
    Deep Work Session Tracker

    No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)

    The version of the OpenAPI document: 0.1.0
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


import unittest

from openapi_client.api.default_api import DefaultApi


class TestDefaultApi(unittest.TestCase):
    """DefaultApi unit test stubs"""

    def setUp(self) -> None:
        self.api = DefaultApi()

    def tearDown(self) -> None:
        pass

    def test_complete_session_sessions_session_id_complete_patch(self) -> None:
        """Test case for complete_session_sessions_session_id_complete_patch

        Complete Session
        """
        pass

    def test_create_session_sessions_post(self) -> None:
        """Test case for create_session_sessions_post

        Create Session
        """
        pass

    def test_get_sessions_history_sessions_history_get(self) -> None:
        """Test case for get_sessions_history_sessions_history_get

        Get Sessions History
        """
        pass

    def test_pause_session_sessions_session_id_pause_patch(self) -> None:
        """Test case for pause_session_sessions_session_id_pause_patch

        Pause Session
        """
        pass

    def test_resume_session_sessions_session_id_resume_patch(self) -> None:
        """Test case for resume_session_sessions_session_id_resume_patch

        Resume Session
        """
        pass

    def test_start_session_sessions_session_id_start_patch(self) -> None:
        """Test case for start_session_sessions_session_id_start_patch

        Start Session
        """
        pass


if __name__ == '__main__':
    unittest.main()
