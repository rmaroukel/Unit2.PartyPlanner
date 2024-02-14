// Declare the API base url
const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FTB-ET-WEB-FT/events';

// Set a state to store/sync data
const state = {
    events: []
};

// Get events HTML element by Id
const eventsList = document.getElementById('events')

// Get form HTML elements by Id
const addEventForm = document.querySelector('#form');
addEventForm.addEventListener("submit", addEvent);


async function render () {
    await getEvents();
    renderEvents()
}

render();

// Fetch the events form the API
async function getEvents() {
    try {
        const response = await fetch (API_URL)
        const json = await response.json()
        return json.data
    } catch(error) {
        console.error(error)
    }
}

// Render the events from the current state
async function renderEvents() {
    state.events = await getEvents();
    
     if (!state.events.length) {
      eventsList.innerHTML = "<h3>No events found</h3>";
      return;
    }
    
    const eventsCards = state.events.map((events) =>{
      const eventsCard = document.createElement('sl-card')
      eventsCard.classList.add('card-header')
      eventsCard.innerHTML = `

      <div slot="header">
     <strong>${events.name}</strong>
    </div>
    ${events.description}
    <div slot="footer">
    <small>Date: <sl-format-date date="${events.date}"></sl-format-date></small>
    <small>Time: <sl-format-date date="${events.date}" hour="numeric" minute="numeric"></sl-format-date></small>
    <sl-button variant="primary" pill class="delete-button">Delete</sl-button>
  </div>
      </sl-card>
      `

      const deleteButton = eventsCard.querySelector('.delete-button');
      deleteButton.addEventListener('click', () => {
          removeEvent(events.id);
      });


      return eventsCard
    })
  
    eventsList.replaceChildren(...eventsCards)
  }

  renderEvents()
  
  async function addEvent(event) {
    event.preventDefault();
    const name = addEventForm.name.value
    const description = addEventForm.description.value
    const date = addEventForm.date.value
    const isoDateString = `${date}T00:00:00Z`;
    const location = addEventForm.location.value
  
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          name: name,
          description: description,
          date: isoDateString,
          location: location
      })
  })
  const json = await response.json();
  render()
  }
  
  async function removeEvent(eventId) {
    const deleteUrl = `${API_URL}/${eventId}`;

    try {
        const response = await fetch(deleteUrl, {
            method: 'DELETE',
        });

        if (response.status === 204) {
            console.log('Event deleted successfully');
            await renderEvents();
        } else {
            console.error('Failed to delete the event');
        }
    } catch (error) {
        console.error('Error deleting the event:', error);
    }
}
