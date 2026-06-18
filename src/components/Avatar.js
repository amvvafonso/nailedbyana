import { Avatar } from 'primereact/avatar';
import Logout from './Logout';
import "../styles/Avatar.css"
import { Link } from "react-router-dom"

export default function UserAvatar({user, image}){
    return (
        <>
        <div className='avatar-div'>
            <div className='dropdown-avatar'>
                <Avatar className='' image={image} style={{margin : 'auto'}} size="xlarge" shape="circle" />
                <div className="dropdown-avatar-content">
                    <Link className="dropdown-text" to={'/'} style={{textDecoration : 'none'}}>{user.name}</Link>
                     {user.permission === '1' ? <>
                     <Link className="dropdown-text" to={'/backoffice/dashboard'} style={{textDecoration : 'none'}}>Backoffice</Link></> : ''}
                    <Logout className="dropdown-text" />
                </div>
            </div>
        </div>
        </>
    )
}
