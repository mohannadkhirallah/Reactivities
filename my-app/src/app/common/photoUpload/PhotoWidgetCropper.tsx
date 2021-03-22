
import React, {Component, useRef} from 'react';
import Cropper from 'react-cropper';
import "cropperjs/dist/cropper.css";

interface IProps
{
    setImage:(file:Blob) =>void;
    imagePreview:string;
}

export const PhotoWidgetCropper:React.FC<IProps> = ({setImage,imagePreview}) => {
    // const cropper =useRef<Cropper>(null);
    const cropper =useRef<Cropper>(null);
    const cropperRef = useRef<HTMLImageElement>(null);

    const cropImage =()=> {
        if(cropper.current &&
             typeof cropper.current.getCroppedCanvas() ==='undefined')
        {
            return;
        }
        cropper && cropper.current && cropper.current.getCroppedCanvas().toBlob((blob:any)=>
        {
            setImage(blob);
        },'image/jpeg')
    }
    return (
        <Cropper
            ref={cropperRef}
            src={imagePreview}
             style={{height: 200, width: '100%'}}
            // Cropper.js options
            preview='.img-preview'
            aspectRatio={1 / 1}
            guides={false}
            viewMode={1}
            dragMode='move'
            scalable={true}
            cropBoxMovable={true}
            cropBoxResizable={true}
            crop ={cropImage}
       />
    )
}