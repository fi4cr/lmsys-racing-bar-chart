import csv
import os
from collections import defaultdict

def extract_top_models():
    data_dir = 'data'
    unique_models = defaultdict(set)  # To store model -> organizations mapping
    
    # Get all CSV files
    csv_files = [f for f in os.listdir(data_dir) if f.endswith('.csv')]
    
    for file in csv_files:
        with open(os.path.join(data_dir, file), 'r') as f:
            reader = csv.DictReader(f)
            # Get top 15 from each file
            for i, row in enumerate(reader):
                if i >= 15:  # Only process top 15
                    break
                unique_models[row['model']].add(row['organization'])
    
    # Print results
    print("Top 15 Models Across All Time Periods:")
    print("-" * 50)
    for model, orgs in sorted(unique_models.items()):
        orgs_str = ', '.join(sorted(orgs))
        print(f"Model: {model}")
        print(f"Organization(s): {orgs_str}")
        print("-" * 50)

if __name__ == "__main__":
    extract_top_models()
