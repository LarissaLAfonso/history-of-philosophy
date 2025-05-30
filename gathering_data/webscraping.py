from urllib.request import urlopen
import urllib.parse
from urllib.error import HTTPError, URLError
import json
from os import path

# Please add more names or find a better alternative for this list.
Philosophers_names = ["Plato", "Aristotle", "Socrates", "René_Descartes", "Immanuel_Kant", "Friedrich_Nietzsche", "David_Hume", "John_Locke", "Bertrand_Russell", "Ludwig_Wittgenstein"]
Possible_interests = ["Epistemology", "Metaphysics", "Ethics", "Logic", "Politics", "Aesthetics"]

def get_infobox(name):
    """
    Fetches the infobox data for a given philosopher from Wikipedia.
    
    :param name: The name of the philosopher.
    :return: string containing the infobox data or None if not found.
    """

    # René_Descartes was breaking the URL, so we need to encode it properly.
    encoded_name = urllib.parse.quote(name, safe='/:?')
    url = f"https://en.wikipedia.org/wiki/{encoded_name}"
    try:
        response = urlopen(url)
    except Exception as e:
        raise Exception(f"Error fetching data for {name}: {e}")
    
    all_content = response.read().decode('utf-8')
    infobox_start = all_content.find('<table class="infobox biography vcard"')
    cut_content = all_content[infobox_start:]
    infobox_end = cut_content.find('</table>')
    infobox_content = cut_content[:infobox_end+len('</table>')]

    return infobox_content

def get_Interests(infobox):
    interests = []
    interests_index = "Main interests"
    interests_start = infobox.find(interests_index)
    if interests_start == -1:
        return None
    interest_section = infobox[interests_start:]
    for interest in Possible_interests:
        if interest_section.find(interest) != -1:
            interests.append(interest)
    
    return interests


def get_wikipedia_data(name):
    try:
        infobox = get_infobox(name)
    except Exception as e:
        raise ValueError(f"Could not retrieve data for {name}: {e}")
    philosopher_data = {
        "name": name,
        "interests": get_Interests(infobox)
    }
    return philosopher_data


if __name__ == "__main__":
    philosophers_data = []
    for name in Philosophers_names:
        try:
            data = get_wikipedia_data(name)
            philosophers_data.append(data)
        except ValueError as e:
            print(e)
    
    relative_path = path.join(path.dirname(__file__), '..', 'src', 'components', 'data', 'philosophers_interests.json')

    with open(relative_path, 'w') as f:
        json.dump(philosophers_data, f, indent=4, ensure_ascii=False)
    
    print(f"Data collection complete. Check {relative_path} for the results.")
    
