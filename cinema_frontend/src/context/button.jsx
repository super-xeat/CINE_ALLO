

export default function Button({children, style, onClick, color, disabled=false}) {

    
    return(
        <button 
            style={style} 
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}