//image cropper 
import { Button } from '@nextui-org/react';
import { useDropzone } from 'react-dropzone';
import React, { useState } from 'react';
import { Cropper, ImageRestriction } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { ImagePlus } from 'lucide-react';
const ImgCrop = ({
  image,
  setImage,
  croppedImage,
  setCroppedImage,
  label,
  className,
  imageType,
  aspect,
}) => {
  const [cropper, setCropper] = useState(null);
  const [isCropping, setIsCropping] = useState(true);
  const [newImage, setNewImage] = useState(null);
  const [newCroppedImage, setNewCroppedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    noClick: true,
    noKeyboard: true,
    onDrop: acceptedFiles => {
      setCroppedImage(acceptedFiles[0]);
    },
  });
  const onChange = cropper => {
    setCropper(cropper);
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyCrop = () => {
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        const dataUrl = canvas.toDataURL();
        setCroppedImage(dataUrl);
        setCropper(null);
        setIsCropping(false);
      }
    }
  };

  const cancelCrop = () => {
    setCroppedImage(null);
    setImage(null);
    setCropper(null);
  };

  return (
    <div
      {...getRootProps({ className: 'dropzone' })}
      onClick={open}
      className={`${className}flex justify-center items-center flex-col text-center`}
    >
      <div>
        <input
          {...getInputProps()}
          id={imageType}
          onChange={handleFileChange}
        />
      </div>

      {image && isCropping && (
        <> 
          <div className="absolute top-[10rem] left-[20rem] flex h-full mx-auto justify-center bg-opacity-80 z-[100] ">
            <div className=" h-[300px] w-[300px]  flex justify-center z-10  flex-col gap-4 p-4 bg-[#f1f1f1] border-2 backdrop-blur-xl    ">
              <Cropper
                src={image}
                onChange={onChange}
                className={'cropper'}
                aspectRatio={aspect}
                initialCrop={{ x: 0, y: 0, width: 100, height: 100 }}
                stencilProps={{
                  handlers: false,
                  lines: false,
                  movable: false,
                  resizable: false,
                }}
                stencilSize={{ width: 300, height: 300 }}
                imageRestriction={ImageRestriction.stencil}
              />
              <div className="flex gap-5 justify-center">
                <Button color="primary" onClick={applyCrop}>
                  Apply Crop
                </Button>
                <Button color="danger" onClick={cancelCrop}>
                  Cancel Crop
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      {croppedImage ? (
        <img src={croppedImage} alt="Cropped Image" className='object-cover' />
      ) : (
        <div >
          {label ? <p className=" flex flex-col justify-center items-center w-full text-primary text-[8px]"><ImagePlus  /> {label}</p>: <ImagePlus className='text-primary' size={32} />  }
        </div>
      )}
    </div>
  );
};

export default ImgCrop;
