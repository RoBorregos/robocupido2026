# Matchmaker demo

Small demo of a heuristic matchmaker.

Quick start:

1. Run the CLI:

```
python -m matchmaker.matcher matchmaker/data/sample_profiles.csv 1 --k 3
```

2. Run tests:

```
python -m unittest discover -v
```

3. Export global one-to-one matches to CSV:

```
python -m matchmaker.matcher matchmaker/data/sample_profiles.csv --export matchmaker/output/matches.csv --min-score 0.0
```

The exported CSV has columns: `id1,name1,id2,name2,score`. Singles appear with `id2`/`name2` empty.
