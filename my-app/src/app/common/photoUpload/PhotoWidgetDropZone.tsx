import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react';

interface IProps {
    setFiles:(files:object[]) =>void
}

const dropZoneStyle = {
    border :'dashed 3px #eee',
    borderColor:'#eee',
    borderRadius:'5px',
    paddingTop:'30px',
    textAlign:'center' as 'center',
    height :'200px'
};
const dropzoneActive={
    borderColor:'green'
}

const  PhotoWidgetDropZone: React.FC<IProps> =({setFiles}) => {
  const onDrop = useCallback(acceptedFiles => {
   setFiles(acceptedFiles.map((file:object)=> Object.assign(file,{
    //  this may lead to memory leak problem since we keep store url for image when ever to upload images wihtout cleaning them
       preview:URL.createObjectURL(file)
   })))
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} style={isDragActive ?{...dropZoneStyle,...dropzoneActive}:dropZoneStyle} >
      <input {...getInputProps()} />
        <Icon name='upload' size='huge'/>
        <Header content='Drop image here'/>
    </div>
  )
}
export default PhotoWidgetDropZone