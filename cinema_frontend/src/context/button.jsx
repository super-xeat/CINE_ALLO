

export default function Button({children, style, onclick, color, disabled=false}) {

    
    return(
        <button style={style} onclick={onclick}>
            {children}
        </button>
    )
}