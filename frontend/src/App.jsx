import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

// Set the document title to your roll number
document.title = 'ABCD123'; // Replace 'ABCD123' with your actual roll number

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [apiError, setApiError] = useState('');

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' },
  ];

  const onSubmit = async (data) => {
    setApiError(''); // Clear previous errors
    try {
      const parsedJson = JSON.parse(data.jsonInput);

      // Validate that 'data' is an array
      if (!Array.isArray(parsedJson.data)) {
        throw new Error("Invalid input. Ensure 'data' is an array.");
      }

      const res = await axios.post('/bfhl', parsedJson);
      setResponse(res.data);
      reset(); // Clear the form after successful submission
    } catch (error) {
      console.error('Error:', error);
      setApiError(error.message || 'An error occurred');
    }
  };

  const handleSelectChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!response) return null;

    const filteredResponse = selectedOptions.reduce((acc, option) => {
      if (response[option]) {
        acc[option] = response[option];
      }
      return acc;
    }, {});

    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold text-lg">Response:</h3>
        <pre className="bg-gray-200 p-2 rounded">{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="block">
          JSON Input:
          <textarea
            className='p-3 rounded-lg bg-white border w-full'
            {...register('jsonInput', {
              required: 'This field is required',
              validate: value => {
                try {
                  const parsed = JSON.parse(value);
                  if (!Array.isArray(parsed.data)) {
                    return "Invalid input. Ensure 'data' is an array.";
                  }
                  return true;
                } catch {
                  return 'Invalid JSON format';
                }
              }
            })}
            placeholder='{"data": ["A","C","z"]}'
            rows={4}
          />
          {errors.jsonInput && (
            <p className="text-red-500 text-sm">{errors.jsonInput.message}</p>
          )}
          {apiError && (
            <p className="text-red-500 text-sm">{apiError}</p>
          )}
        </label>
        <button
          type="submit"
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
          Submit
        </button>
      </form>

      {response && (
        <>
          <div className="mt-4">
            <label className="block mb-2">Select Response Data to Display:</label>
            <select
              multiple
              onChange={handleSelectChange}
              className="w-full p-2 border rounded">
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {renderResponse()}
        </>
      )}
    </div>
  );
}

export default App;
