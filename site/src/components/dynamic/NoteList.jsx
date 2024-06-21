import { useState, useEffect } from 'preact/hooks';
import markdownit from 'markdown-it';
const md = markdownit();

const BASE_URL = 'https://directus.aaronczichon.de';

export default function NoteList() {
  const [items, setItems] = useState([]);

  useEffect(async () => {
    const response = await fetch(`${BASE_URL}/items/microblog`);
    const result = await response.json();
    let items = result.data;
    // sort items by creation date
    items = items.sort((a, b) => {
      const aCreated = new Date(a.date_created);
      const bCreated = new Date(b.date_created);

      return aCreated > bCreated ? 1 : -1;
    });
    setItems(items);
  }, []);

  const getFormattedDate = (date) => {
    const d = new Date(date);
    const browserLang = window.navigator.language;
    return `${d.toLocaleDateString(browserLang)} ${d.toLocaleTimeString(browserLang, {timeStyle: 'short'})}`;
  }

  return (
    <ol class="note-list">
      {
        items.map(item => (
            <li class="note-list-item">
              <a href="#2" target="_blank">
                <h3 id="2">{item.title}</h3>
              </a>
              <p class="note-list-item--time">{getFormattedDate(item.date_created)}</p>
              <p dangerouslySetInnerHTML={{__html: md.render(item.text)}}>
              </p>
              <hr>
              </hr>
            </li>
          )
        )
      }
    </ol>
  );
}