ducks = []
total_races = 0

def add_duck():
    name = f"Duck{len(ducks)+1}"
    ducks.append({"name": name, "wins": 0, "losses": 0})
    print(f"Added: {name}")

def add_loss(index):
    ducks[index]["losses"] += 1
    print(f"{ducks[index]['name']} got a loss.")

def mark_win(index):
    global total_races
    ducks[index]["wins"] += 1
    total_races += 1
    print(f"{ducks[index]['name']} won the race!")

def copy_stats():
    total_adjusted = sum(d["losses"] +1 for d in ducks)