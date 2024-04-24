import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import FloatingButtons from "./FloatingButtons";
import { apiUrl } from "../api";

import './Character.css';

const getCharacter = async (id) => {
  const response = await fetch(apiUrl(`/person/${id}`));
  const character = await response.json();
  return character;
}

const getCharacterStory = async (id) => {
  const response = await fetch(apiUrl(`/story/person/${id}`));
  const character = await response.json();
  return character;
}

const getFleet = async () => {
  const response = await fetch(apiUrl("/fleet?show_hidden=true"));
  const fleet = await response.json();
  return fleet;
}

const getMessages = async () => {
  const response = await fetch(apiUrl(`/story/messages/`));
  const messages = await response.json();
  return messages;
}

const is_npc = (character) => {
  if (!character)
    return null
  if (character.is_character === true)
    return 'Character'
  else if (character.is_character === false)
    return 'NPC'
  else
    return 'Random Generated Character'
}

export default function Character(props) {
  const [character, setCharacter] = React.useState(null);
  const [characterStory, setCharacterStory] = React.useState(null);
  const [fleet, setFleet] = React.useState([]);
  const [messages, setMessages] = React.useState([]);

  const params = useParams();

  React.useEffect(() => {
    if (!params.id) return;
    getCharacter(params.id).then((s) => setCharacter(s));
  }, [params.id, setCharacter]);

  React.useEffect(() => {
    if (!params.id) return;
    getCharacterStory(params.id).then((s) => setCharacterStory(s));
  }, [params.id, setCharacterStory]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [fleetData, messageData] = await Promise.all([
          getFleet(),
          getMessages(),
        ]);

        setFleet(fleetData);
        setMessages(messageData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  React.useEffect(() => {
    props.changeTab('Characters');
  }, [props]);

  const renderCharacter = () => {
    if (!character) return null;
    const military_history = character.entries.filter((e) => e.type === "MILITARY").map((e) => e.entry.split('\n\n')).flat();
    const military_history_list = military_history.map(milhistory => <li key={milhistory}>{milhistory}</li>);
    const medical_history = character.entries.filter((e) => e.type === "MEDICAL").map((e) => e.entry.split('\n\n')).flat();
    const medical_history_list = medical_history.map(medhistory => <li key={medhistory}>{medhistory}</li>);
    const personal_history = character.entries.filter((e) => e.type === "PERSONAL").map((e) => e.entry.split('\n\n')).flat();
    const personal_history_list = personal_history.map(phistory => <li key={phistory}>{phistory}</li>);

    const character_summary = character.summary ? character.summary.split('\n') : [];
    const personal_secret_info = character.personal_secret_info ? character.personal_secret_info.split('\n') : [];
    const personal_secret_info_list = personal_secret_info.map(secretinfo => <li key={secretinfo}>{secretinfo}</li>);



    const relatedMessageIds = characterStory.messages.map(m => m.id);
    const relatedMessages = messages.filter(m => relatedMessageIds.includes(m.id));


    const getShipById = (ship_id) => {
      const shipName = (ship_id ? fleet.find(ship => ship.id === ship_id)?.name : "");
      return shipName;
    }

    const family_list = character.family.map(person => <li key={person}><Link onClick={() => props.changeTab('Characters')} to={`/characters/${person.id}`}>{person.full_name}</Link> ({person._pivot_relation}, {person.status}, {is_npc(person)}, {person.ship_id && getShipById(person.ship_id)})</li>);
    const relations_list = characterStory.relations.map(person => <li key={person}><Link onClick={() => props.changeTab('Characters')} to={`/characters/${person.id}`}>{person.name}</Link> ({person.relation}, {person.status}, {is_npc(person)}, {person.ship && getShipById(person.ship)})</li>);
    const military_academies_list = character.military_academies && character.military_academies.split(',').map(r => <li key={r}>{r}</li>);

    return (
      <div className='character'>
        <Container fluid className='character'>
          <Row>
            <Col sm>
              <a href={character.link_to_character} target="_blank" rel="noreferrer">Link to Character document</a>
            </Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Basic Info</span></Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Name: </span>{character.full_name}</Col>
            <Col sm><span className='caption'>Age: </span>{542 - character.birth_year}</Col>
            <Col sm><span className='caption'>Birth Year: </span>{character.birth_year}</Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Title: </span>{character.title ? character.title : "-"}</Col>
            <Col sm><span className='caption'>Card ID: </span>{character.card_id}</Col>
            <Col sm><span className='caption'>Bio ID: </span>{character.bio_id}</Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Occupation: </span>{character.occupation}</Col>
            <Col sm><span className='caption'>Home planet: </span>{character.home_planet}</Col>
            <Col sm><span className='caption'>Citizen ID: </span>{character.citizen_id}</Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>File created: </span>{character.created_year}</Col>
          </Row>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header'>Social Details</span></Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Social Class: </span>{character.social_class}</Col>
            <Col sm={8}><span className='caption'>Religion: </span>{character.religion}</Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Dynasty: </span>{character.dynasty}</Col>
            <Col sm={8}><span className='caption'>Political Party: </span>{character.political_party}</Col>
          </Row>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header'>Current Status</span></Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Status: </span>{character.status}</Col>
            <Col sm><span className='caption'>Ship: </span>{character.ship ? <span className='fleet'><Link onClick={() => props.changeTab('Fleet')} to={`/fleet/${character.ship.id}`}>{character.ship.name}</Link></span> : "None"}</Col>
            <Col sm><span className='caption'>Shift: </span>{character.shift ? character.shift : "-"}</Col>
          </Row>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header'>GM Information</span></Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Role: </span>{character.role ? character.role : "-"}</Col>
            <Col sm><span className='caption'>Character group: </span>{character.character_group}</Col>
            <Col sm><span className='caption'>Elder gene: </span>{character.medical_elder_gene ? "Yes" : "No"}</Col>
          </Row>
          <Row>
            <Col sm={4}><span className='caption'>Additional role: </span>{character.role_additional ? character.role_additional : "-"}</Col>
            <Col sm={8}><span className='caption'>Special group: </span>{character.special_group ? character.special_group : "-"}</Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Summary / Cheat Sheet</span></Col>
          </Row>
          {character_summary.length < 1 ? <p>No summary</p> : <ul>{character_summary.map(n => <li key={n}><Row><Col sm>{n}</Col></Row></li>)}
          </ul>}
          <Row>
            <Col sm><span className='mini-header'>GM Notes</span></Col>
          </Row>
          <Row>
            <Col sm><span>{character.gm_notes < 1 ? <p>No GM notes available.</p> : character.gm_notes}</span></Col>
          </Row>
          <Row>
            <Col sm={4}><span className='mini-header'>Plots</span>
              <span>{characterStory.plots.length < 1 ? <p>No linked plots</p> : <ul> {characterStory.plots.map(p => <li key={p.id}>
                <Link onClick={() => props.changeTab('Plots')} to={`/plots/${p.id}`}>{p.name}</Link></li>)}
              </ul>
              }</span>
            </Col>
            <Col sm={8}><span className='mini-header'>Events</span>
              <span>{characterStory.events.length < 1 ? <p>No linked Events</p> : <ul> {characterStory.events.map(e => <li key={e.id}>
                <Link onClick={() => props.changeTab('Events')} to={`/events/${e.id}`}>{e.name}</Link></li>)}
              </ul>
              }</span>
            </Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Messages</span>
              <span>{characterStory.messages.length < 1 ? <p>No messages</p> : <ul> {relatedMessages.map(m => <li key={m.id}>
                <Link onClick={() => props.changeTab('Messages')} to={`/messages/${m.id}`}>{m.name}</Link> - Sent: {m.sent}</li>)}
              </ul>
              }</span>
            </Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header new'>GM Notes During the Runs [ADD NOTE BUTTON] [HIDE PREVIOUS RUNS CHECKBOX]</span></Col>
          </Row>
          <ul><li><Row>
            <Col sm><span>Timestamp: Note 6</span></Col>
          </Row></li>
            <li><Row>
              <Col sm><span>Timestamp: Note 5</span></Col>
            </Row></li>
            <li><Row>
              <Col sm><span>Timestamp: Note 4</span></Col>
            </Row></li>
            <li><Row>
              <Col sm><span>Timestamp: Note 3</span></Col>
            </Row></li>
            <li><Row>
              <Col sm><span>Timestamp: Note 2</span></Col>
            </Row></li>
            <li><Row>
              <Col sm><span>Timestamp: Note 1</span></Col>
            </Row></li>
          </ul>
          <Row>
            <Col sm><span className='new'>Save the notes between games!</span></Col>
          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header' id='personal'>Personal</span></Col>
          </Row>
          <Row>
            <Col sm>{personal_history_list ? <ul>{personal_history_list}</ul> : "None"}</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Family</span></Col>
          </Row>
              <Row>
          <Col sm>{family_list ? <ul>{family_list}</ul> : "None"}</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header'>Other known relations</span></Col>
          </Row>
          <Row>
          <Col sm>{relations_list ? <ul>{relations_list}</ul> : "None"}</Col>
          </Row>

          <Row>
            <Col sm><span className='mini-header'>Classified personal data:</span></Col>
          </Row>
         <Row>
          <Col sm>{personal_secret_info_list ? <ul>{personal_secret_info_list}</ul> : "None"}</Col>
          </Row>
          <Row>
            <Col sm><span className='mini-header' id='military'>Military</span></Col>
          </Row>
          <Row>
            <Col sm={4}>
              <span className='caption'>Military Academy: </span>
              {military_academies_list ? <ul>{military_academies_list}</ul> : "None"}
            </Col>

            <Col sm={8}><span className='caption'>Military Rank: </span>{character.military_rank ? character.military_rank : "-"}</Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Military Service History:</span>{military_history.length === 0 && " None"}</Col>
          </Row>
          <Row>
            <Col sm>{military_history_list ? <ul>{military_history_list}</ul> : "None"}</Col>
          </Row>
          <Row>
            <Col sm>
              <span className='caption'>Military Remarks:</span>{!character.military_remarks && " None"}
              {character.military_remarks && <ul>{character.military_remarks.split('\n\n').filter(Boolean).map(r => <li>{r}</li>)}</ul>}
            </Col>
          </Row>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header' id='medical'>Medical</span></Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Fitness Level: </span>{character.medical_fitness_level ? character.medical_fitness_level : "-"}</Col>
            <Col sm><span className='caption'>Blood Type: </span>{character.medical_blood_type ? character.medical_blood_type : "-"}</Col>
            <Col sm><span className='caption'>Last Fitness Check: </span>{character.medical_last_fitness_check ? character.medical_last_fitness_check : "-"}</Col>
          </Row>
          <Row>
            <Col sm>
              <span className='caption'>Active Conditions: </span>{!character.medical_active_conditions && "None"}
              {character.medical_active_conditions && <ul>{character.medical_active_conditions.split('\n\n').filter(Boolean).map(c => <li>{c}</li>)}</ul>}
            </Col>
            <Col sm>
              <span className='caption'>Current Medication: </span>{!character.medical_current_medication && "None"}
              {character.medical_current_medication && <ul>{character.medical_current_medication.split('\n\n').filter(Boolean).map(m => <li>{m}</li>)}</ul>}
            </Col>
            <Col sm>
              <span className='caption'>Allergies: </span>{!character.medical_allergies && "None"}
              {character.medical_allergies && <ul>{character.medical_allergies.split(',').filter(Boolean).map(c => <li>{c}</li>)}</ul>}
            </Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Medical History:</span>{medical_history.length === 0 && " None"}</Col>
          </Row>
          <Row>
            <Col sm>{medical_history_list ? <ul>{medical_history_list}</ul> : "None"}</Col>
          </Row>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header'>Groups/Roles</span></Col>
          </Row>
          {character.groups.length === 0 && <Row><Col sm>None</Col></Row>}
          <ul>{character.groups.map(group => <li><Row key={group}><Col sm>{group}</Col></Row></li>)}</ul>
          <Row className='row-mini-header'>
            <Col sm><span className='mini-header'>Metadata</span></Col>
          </Row>
          <Row>
            <Col sm><span className='caption'>Is Character: </span>{is_npc(character)}</Col>
            <Col sm><span className='caption'>Is Visible: </span>{character.is_visible ? "Yes" : "No"}</Col>
            <Col sm><span className='caption'>Database ID: </span>{character.id}</Col>

          </Row>
          <Row>
            <Col sm>&nbsp;</Col>
          </Row>
        </Container>
      </div>
    )
  }

  return (
    <div className='character'>
      <h1 className='character' id="app-title">{character?.full_name} ({is_npc(character)})</h1>
      {renderCharacter()}
      <FloatingButtons />
    </div>
  );
}
