import "../styles/ItemAdd.css"
import { InputNumber } from 'primereact/inputnumber';


export default function ItemAdd({ item, updateItem }){
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const previewURL = URL.createObjectURL(file)
        updateItem(item.tempId, "image", previewURL)
    }
    return (
        <>  
            <div className="item-add-outer-div">
                <div className="item-add-image-div">
                    <img id={item.tempId + '_preview'} className="item-add-image" src={item.image} alt="itemPreview"/>
                </div>
                <div className="item-add-info-div">
                    <input className="item-add-input" onChange={(e) => updateItem(item.tempId, "contrast", e.target.value)} required placeholder="Contraste"/>
                    <input className="item-add-input" onChange={(e) => updateItem(item.tempId, "total_stock", e.target.value)} required placeholder="Stock"/>
                    <InputNumber required placeholder="Preço" inputId="currency-germany" value={item.price} onValueChange={(e) => updateItem(item.tempId, "price", e.target.value)} mode="currency" currency="EUR" locale="pt-PT" />
                    <input
                        required
                        id={item.tempId}
                        name={item.tempId}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        />
                </div>
            </div>
         
        </>
    )
}
