/*jshint esversion: 8 */

const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');


const apiURL = 'https://api.lyrics.ovh';
//api that give lyrics

//Search for Songs by song name or artists
async function searchSongs(term) {
    //to fetch songs from the api
    // fetch(`${apiURL}/suggest/${term}`)
    //first promise
    //send the response in the Json format
    // .then(res => res.json()) 
    //second promise
    //send the data to the console
    // .then(data => console.log(data));

    //create a variable to store our first response
    const res = await fetch(`${apiURL}/suggest/${term}`);
    //since fetch is async so we are keeping to wait
    // alert("2");
    const data = await res.json();
    // alert("3");
    // console.log(data);
    showData(data);
    // alert("4");
}


//Show songs and artist in DOM
function showData(data) {
    // // alert("5");
    // let output = ''; //initializing
    // // alert("6");
    // data.data.forEach(song => { //data which has an array called data
    //     // alert("7");
    //     output += `
    //     <li>
    //     <snap><strong>${song.artist.name}</strong> - ${song.title}</snap>
    //     <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}"> Get lyrics </button>
    //     </li>
    //     `;
    // });
    // // alert("8");
    // result.innerHTML = `
    //     <ul class="songs">
    //         ${output}
    //     </ul>
    // `;
    // alert("9");
    //directly setting the results
    result.innerHTML = `
        <ul class="songs">
        ${data.data
            .map(
                song => ` <li>
                <snap><strong>${song.artist.name}</strong> - ${song.title}</snap>
                <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}"> Get lyrics </button>
            </li>
            `)
            .join('')
        }
        </ul>
    `;
    //if there is more songs to navigate we use this code
    //if there is more songs then a next button will appear 
    //if there are songs on previous page then 
    if(data.prev || data.next ){
        more.innerHTML=`                  
        ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`:``}
        ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`:``}
        `;
    }else{
        more.innerHTML=``;
    }

}

async function getMoreSongs(url){
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    showData(data);
}


//let's fetch lyrics
async function getLyrics(a,b) {
    const res=await fetch(`${apiURL}/v1/${a}/${b}`);
    const data=await res.json();

    console.log(data);

    const lyrics=data.lyrics.replace(/\r\n|\r|\n/g,'<br>');

    result.innerHTML=`<h2><strong>${a}</strong> - ${b}</h2>
    <span>${lyrics}</span>
    `;

    more.innerHTML='';


}


//Event listeners
//no need of parentheses because only one parameter
form.addEventListener('submit', e => {
    //preventDefault prevents an event to perform the default functions
    e.preventDefault();

    const searchTerm = search.value.trim(); //storing the value which we have typed in the search bar. 

    // console.log(searchTerm);
    // if nothing is typed in searchTerm then we gonna send an alert message
    if (!searchTerm) {
        alert('Please type in a search term');
    } else {
        searchSongs(searchTerm);
        // alert("1");
    }
});



result.addEventListener('click',e=>{
    const clickedEl =e.target;

    if(clickedEl.tagName === 'BUTTON'){
        // console.log('123');
        const artist=clickedEl.getAttribute('data-artist');
        const songTitle=clickedEl.getAttribute('data-songtitle');

        getLyrics(artist,songTitle);
    }
});