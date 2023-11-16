import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import Nav from './Nav';
import { supabase } from '../../client';

const CharacterSelector = () => {
  const [characterOptions, setCharacterOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState({
    name: 'NA',
    region: 'NA',
    vision: 'NA',
  });
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    Papa.parse(`/media/genshin.csv`, {
      download: true,
      header: true,
      complete: (result) => {
        const options = result.data.map((row, index) => ({
          index,
          img_src: row.character_name.replace(' ', '_'),
          name: row.character_name,
          region: row.region,
          vision: row.vision,
          label: `${row.character_name} - ${row.region} - ${row.vision}`,
        }));
        options.unshift({
          index: -1,
          img_src: '',
          name: 'no character',
          region: 'NA',
          vision: 'NA',
          label: 'Select a character (Format: Character Name - Region - Vision)',
        });
        setCharacterOptions(options);
      },
    });
  }, []);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    console.log(selectedValue);

    if (selectedValue === 'no character,NA,NA') {
      setSelectedOption('');
      setSelectedCharacter({
        name: 'NA',
        region: 'NA',
        vision: 'NA',
      });
    } else {
      setSelectedOption(selectedValue);

      const [name, region, vision] = selectedValue.split(',');

      const characterDetails = characterOptions.find(
        (character) =>
          character.name === name &&
          character.region === region &&
          character.vision === vision
      );

      setSelectedCharacter(characterDetails);
    }
  };

  const shortenName = (name) => {
    if (name && name.indexOf(' ') !== -1) {
      const firstWord = name.split(' ')[0];
      return name.slice(firstWord.length);
    }
    return name;
  };

  const handleSubmit = async () => {
    // Check if any required fields are blank
    if (!selectedOption) {
      alert('Please select a character.');
      return;
    }
  
    const titleValue = titleRef.current.value;
    const contentValue = contentRef.current.value;
  
    // Check if title and content are not blank
    if (!titleValue.trim() || !contentValue.trim()) {
      alert('Please fill in both title and content fields.');
      return;
    }
  
    try {
      // Insert data into supabase.posts
      const { data, error } = await supabase.from('posts').insert([
        {
          genshin_character: selectedCharacter.name,
          region: selectedCharacter.region || null,
          vision: selectedCharacter.vision || null,
          post_title: titleValue,
          post_text: contentValue,
          img_url: `/media/character_icons/${selectedCharacter.name.replace(' ', '_')}_Icon.png` || null,
        },
      ]);
  
      if (error) {
        console.error('Error inserting data:', error);
        return;
      }
  
      console.log('Data inserted successfully:', data);
      window.location.href = `/`;
      
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  
  return (
    <div className='create-post'>
      <Nav />
      <div className='see-through'>
        <h1>Create A New Post</h1>
        <select value={selectedOption} onChange={handleOptionChange}>
          {characterOptions.map((option) => (
            <option
              key={`${option.name}_${option.region}_${option.vision}`}
              value={`${option.name},${option.region},${option.vision}`}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className='img-des-content'>
          <div className='img-previews' style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              {selectedOption ? (
                <img
                  className='icons'
                  src={`/media/character_icons/${selectedCharacter.name.replace(
                    ' ',
                    '_'
                  )}_Icon.png`}
                  alt={`${selectedOption} Icon`}
                />
              ) : (
                <img
                  className='icons'
                  src={`/media/character_icons/no_character_Icon.webp`}
                  alt='Default Icon'
                />
              )}
              <label className='character-name'>
                {selectedCharacter ? shortenName(selectedCharacter.name) : 'NA'}
              </label>
            </div>
            <div>
              {selectedCharacter ? (
                <img
                  className='icons'
                  src={`/media/region_icons/${selectedCharacter.region}.png`}
                  alt={`${selectedCharacter.region} Icon`}
                />
              ) : (
                <img
                  className='icons'
                  src={`/media/region_icons/NA.webp`}
                  alt='Default Icon'
                />
              )}
              <label>
                {selectedCharacter ? selectedCharacter.region : 'No character selected'}
              </label>
            </div>
            <div>
              {selectedCharacter ? (
                <img
                  className='icons'
                  src={`/media/vision_icons/${selectedCharacter.vision}.png`}
                  alt={`${selectedCharacter.vision} Icon`}
                />
              ) : (
                <img
                  className='icons'
                  src={`/media/vision_icons/NA.webp`}
                  alt='Default Icon'
                />
              )}
              <label>
                {selectedCharacter ? selectedCharacter.vision : 'No character selected'}
              </label>
            </div>
          </div>
          <div>
            <label htmlFor='title'>Title</label>
            <br />
            <input id='title' type='text' ref={titleRef} />
            <br />
            <br />
            <label htmlFor='content'>Content</label>
            <br />
            <textarea id='content' rows='5' cols='80' ref={contentRef}></textarea>
            <br />
            <br />
          </div>
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default CharacterSelector;
