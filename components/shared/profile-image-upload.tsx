"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoMdDownload } from "react-icons/io";
import { MdEdit } from "react-icons/md";

interface Props {
  profileImage: string;
  onChange: (profileImage: string) => void;
}

const ProfileImageUpload = ({ onChange, profileImage }: Props) => {
  const [image, setImage] = useState(profileImage);

  const handleChange = useCallback(
    (coverImage: string) => {
      onChange(coverImage);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (files: any) => {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (evt: any) => {
        setImage(evt.target.result);
        handleChange(evt.target.result);
      };
      reader.readAsDataURL(file);
    },
    [handleChange]
  );

  const { getInputProps, getRootProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  return (
    <div
      {...getRootProps({
        className: "text-white text-center border-none rounded-md",
      })}
    >
      <input {...getInputProps()} />
      {image ? (
        <div className="relative -top-20 left-6 rounded-full transition cursor-pointer w-32 h-32 border-4 border-black">
          <Image
            src={image}
            fill
            alt="Uploaded image"
            style={{ objectFit: "cover", borderRadius: "100%" }}
          />
          <div className="absolute inset-0 rounded-full flex justify-center items-center">
            <MdEdit size={24} className={"text-white"} />
          </div>
        </div>
      ) : (
        <div className="relative -top-20 left-6">
          <div
            className={`rounded-full transition cursor-pointer relative w-32 h-32 border-4 border-black`}
          >
            <Image
              fill
              style={{ objectFit: "cover", borderRadius: "100%" }}
              alt="Avatar"
              src={"/images/placeholder.png"}
            />
            <div className="absolute inset-0  bg-black/40 rounded-full flex justify-center items-center">
              <IoMdDownload size={40} className={"text-black"} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;
