import random
import string


def generate_string(count : int = 20)->str:
    return ''.join(random.choice(string.ascii_uppercase + string.digits + string.ascii_lowercase) for _ in range(count))
