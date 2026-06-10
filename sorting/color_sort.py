from .sorting import SortingCriteria
from util import get_colors

class ColorSort(SortingCriteria):
    def __init__(self, num_bins):
        assert num_bins == 7
        super().__init__(num_bins)
        
    def sort(self, card_name):
        colors = get_colors(card_name)
        if len(colors) > 1:
            return 6
        elif 'W' in colors:
            return 1
        elif 'U' in colors:
            return 2
        elif 'B' in colors:
            return 3
        elif 'R' in colors:
            return 4
        elif 'G' in colors:
            return 5
        else:
            return 0
        