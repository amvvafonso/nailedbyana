
import { ProgressSpinner } from 'primereact/progressspinner';

export default function FullscreenLoading(){


    return (
        <>
        <div style={{width: '100vw', height : '100vh', backgroundColor : 'white', textAlign : 'center', alignContent : 'center'}}>
             <ProgressSpinner style={{ width: '70px', height: '70px', margin : 'auto' }} />
             <h2>A carregar...</h2>
        </div>
        </>
    )
}

export function LoadingComponent(){
      return (
        <>
        <div style={{width: '100%', backgroundColor : 'white', textAlign : 'center', alignContent : 'center'}}>
             <ProgressSpinner style={{ width: '70px', height: '70px', margin : 'auto' }} />
             <h2>A carregar...</h2>
        </div>
        </>
    )
}
