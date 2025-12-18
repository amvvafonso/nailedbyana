import "../styles/Item.css"

export default function Contrast(props){
    return (
        <>
            {props.state == 1 ? <>
            <div className={props.selected ? 'contrast selected' : 'contrast'}>
                <p className="contrast-text">{props.contrast}</p>
            </div>
            </> : <>
                <div className="contrast crossed">
                    <p className="contrast-text">{props.contrast}</p>
                </div>
            </>}
            
        </>
    )
}
