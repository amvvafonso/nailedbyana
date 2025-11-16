import { Avatar } from 'primereact/avatar';
import Logout from './Logout';
import "../components/Components.css"
import { Link } from "react-router-dom"

export default function UserAvatar({user, image}){
    return (
        <>
        <div className='avatar-div'>
            <div className='dropdown-avatar'>
                <Avatar className='' image={image} style={{margin : 'auto'}} size="xlarge" shape="circle" />
                <div className="dropdown-avatar-content">
                    <Link className="dropdown-text" to={'/'} style={{textDecoration : 'none'}}>{user.name}</Link>
                     {user.permission === '1' ? <><Link className="dropdown-text" to={'backoffice'} style={{textDecoration : 'none'}}>Backoffice</Link></> : ''}
                    <Logout style={{textAlign : 'left'}}/>
                </div>
            </div>
        </div>
        </>
    )
}
