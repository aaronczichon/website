import markdownit from 'markdown-it';

const md = markdownit({
  highlight: (str, lang) => {
    console.log(lang);
    return '<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

export default function NoteList({ item }) {

  const getFormattedDate = (date) => {
    const d = new Date(date);
    const browserLang = window.navigator.language;
    return `${d.toLocaleDateString(browserLang)} ${d.toLocaleTimeString(browserLang, {timeStyle: 'short'})}`;
  }

  /**
   * Extract the hash link from URL and check if it matches the item id
   */
  const applyActiveClass = () => {
    const hash = location.hash.replace('#', '');
    return hash && parseInt(hash) === item.id ? ' note-list-item--active' : '';
  }

  return (
    <li class={'note-list-item' + applyActiveClass()}>
      <a href={`#${item.id}`} target="_blank">
        <h3 id={item.id}>{item.title}</h3>
      </a>
      <p class="note-list-item--time">{getFormattedDate(item.date_created)}</p>
      <p dangerouslySetInnerHTML={{__html: md.render(item.text)}}>
      </p>
      <hr>
      </hr>
    </li>
  );
}