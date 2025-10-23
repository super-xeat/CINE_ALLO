
import {Link} from 'react-router-dom'

export default function Card_film({film}) {

    return (
        <div>
            <Link to={`/detail_film/${film.id}`}>
                <h1>{film.original_title}</h1>
            </Link>
            <h2>{film.release_date}</h2>
            <p>{film.overview}</p>

        </div>
    )
}