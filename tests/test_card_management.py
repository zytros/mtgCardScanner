import unittest
from unittest.mock import patch

from card_management import Arduino, Camera, CardSorterRobot, CardSorterSoftware, SortingCriteria


class CardSorterSoftwareTests(unittest.TestCase):
    def setUp(self):
        self.robot = CardSorterRobot(
            5,
            SortingCriteria("cmc", 5),
            Arduino(11500, 5),
            Camera("test"),
        )

    @patch("card_management.get_cards_in_set")
    def test_reload_set_data_updates_cards_and_filename(self, mock_get_cards):
        mock_get_cards.return_value = (["Card A"], [1.25])
        sorter = CardSorterSoftware("data", "", self.robot, "sos")

        mock_get_cards.return_value = (["Card B"], [2.5])
        sorter.reload_set_data("khm")

        self.assertEqual(sorter.set_code, "khm")
        self.assertEqual(sorter.card_names, ["Card B"])
        self.assertEqual(sorter.card_prices, [2.5])
        self.assertIn("khm", sorter.fn)
        self.assertEqual(sorter.card_nr, 0)
        self.assertEqual(sorter.card_data_list, [])


if __name__ == "__main__":
    unittest.main()
