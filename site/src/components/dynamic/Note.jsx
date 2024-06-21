import markdownit from 'markdown-it';
const md = markdownit();

export default function NoteList({ item }) {

  const getFormattedDate = (date) => {
    const d = new Date(date);
    const browserLang = window.navigator.language;
    return `${d.toLocaleDateString(browserLang)} ${d.toLocaleTimeString(browserLang, {timeStyle: 'short'})}`;
  }

  return (
    <li class="note-list-item">
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