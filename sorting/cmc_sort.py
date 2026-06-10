from .sorting import SortingCriteria
from util import get_cmc

class CMCSort(SortingCriteria):
    def __init__(self, num_bins):
        assert num_bins == 7
        super().__init__(num_bins)
        
    def sort(self, card_name):
        cmc = int(get_cmc(card_name))
        return min(cmc, self.num_bins - 1)