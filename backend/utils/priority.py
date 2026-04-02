def suggest_priority(title):
    title = title.lower()

    if "urgent" in title or "asap" in title:
        return "High"
    elif "later" in title or "optional" in title:
        return "Low"
    else:
        return "Medium"