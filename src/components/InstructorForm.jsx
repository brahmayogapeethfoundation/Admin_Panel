import React, { useEffect, useState } from "react";

const InstructorForm = ({ onSubmit, initialData }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setRole(initialData.role || "");
      setBio(initialData.description || "");
      setExistingPhoto(initialData.imageUrl || ""); 
      setPhoto(null);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      name,
      role,
      bio,
      photo: photo || existingPhoto, 
    });

    // reset form
    setName("");
    setRole("");
    setBio("");
    setPhoto(null);
    setExistingPhoto("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-lg sm:text-xl font-semibold">
        {initialData ? "Edit Instructor" : "Add Instructor"}
      </h2>

   
      <input
        type="text"
        placeholder="Name"
        className="border rounded p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

     
      <input
        type="text"
        placeholder="Role"
        className="border rounded p-2 w-full"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      />

    
      <textarea
        placeholder="Bio"
        className="border rounded p-2 w-full"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        required
      />

    
      {(photo || existingPhoto) && (
        <div>
          <p className="text-sm font-medium">
            {photo ? "New Photo Preview" : "Current Photo"}
          </p>
          <img
            src={photo ? URL.createObjectURL(photo) : existingPhoto}
            alt="Instructor"
            className="w-32 h-32 object-cover rounded mt-2"
          />
        </div>
      )}

      
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
      />

     
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {initialData ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default InstructorForm;
