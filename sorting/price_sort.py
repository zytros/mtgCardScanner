from .sorting import SortingCriteria
from util import get_price

class PriceSort(SortingCriteria):
    def __init__(self, num_bins):
        super().__init__(num_bins)
        self.bin_0 = 0
        self.bin_1 = 0.2
        self.bin_2 = 0.5
        self.bin_3 = 1
        self.bin_4 = 2
        self.bin_5 = 5
        self.bin_6 = 10
        
    def sort(self, card_name):
        try:
            price = float(get_price(card_name))
        except:
            price = -1
        if price >= self.bin_6:
            return 6
        elif price >= self.bin_5:
            return 5
        elif price >= self.bin_4:
            return 4
        elif price >= self.bin_3:
            return 3
        elif price >= self.bin_2:
            return 2
        elif price >= self.bin_1:
            return 1
        else:
            return 0