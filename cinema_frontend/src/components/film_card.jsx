


export default function Card_film({film}) {

    return (
        <div>
            <h1>{film.original_title}</h1>
            <h2>{film.release_date}</h2>
            <p>{film.overview}</p>

        </div>
    )
}