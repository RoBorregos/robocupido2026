import unittest
from matchmaker import matcher
import os


class MatcherTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        base = os.path.dirname(__file__)
        cls.csv = os.path.join(base, '..', 'data', 'sample_profiles.csv')
        cls.profiles = matcher.load_profiles_from_csv(cls.csv)

    def test_load_profiles(self):
        self.assertTrue(len(self.profiles) >= 6)

    def test_jaccard(self):
        a = {'music', 'cinema'}
        b = {'music', 'art'}
        self.assertAlmostEqual(matcher.jaccard(a, b), 1/3)

    def test_cosine(self):
        v1 = [1, 0]
        v2 = [0, 1]
        self.assertAlmostEqual(matcher.cosine(v1, v2), 0.0)

    def test_find_match_for_ana(self):
        # Ana (id=1) should match well with Diego (4) and Mariana (5) in Madrid
        matches = matcher.find_matches_for_user('1', self.profiles, top_k=3)
        ids = [m[0]['id'] for m in matches]
        self.assertIn('4', ids)

    def test_traits_parsing_and_normalization(self):
        # Profiles should have trait vectors of length 5 and values in 0..1
        for p in self.profiles:
            self.assertIsInstance(p.get('traits'), list)
            if p.get('traits'):
                self.assertEqual(len(p['traits']), 5)
                self.assertTrue(all(0.0 <= v <= 1.0 for v in p['traits']))


if __name__ == '__main__':
    unittest.main()
