

export default function CommentItem({item}) {

    return(
        <div>
            <h1>{item.autor}</h1>
            <p>{item.texte}</p>
            <h4>{item.date}</h4>
        </div>
    )
}