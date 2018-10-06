import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient){
    this.getPokemon();
  }

  getPokemon() {
    let pokemon = this._http.get('https://pokeapi.co/api/v2/pokemon/1/');
    pokemon.subscribe(pokemon => {
      const ownAbilities = pokemon["abilities"];
      const name = pokemon["name"];
      let abilArr: Array<string> = [];

      for (let ownAbil of pokemon["abilities"]) {
        abilArr.push(ownAbil["ability"]["name"]);
      }
      console.log(`${name} knows ${abilArr.join(' and ')}.`)
      for (let ownAbil of ownAbilities) {        
        // Get ability data
        const url = ownAbil["ability"]["url"]
        let ability = this._http.get(url)
        ability.subscribe(abilityData => {
          let count = 0;
          for(let i in abilityData["pokemon"]) {
            count++;
          }
          console.log(`${count} other Pokemons shares the ability ${ownAbil["ability"]["name"]} with ${name}`)

          for(let i in abilityData["pokemon"]) {

            const url = abilityData["pokemon"][i]["pokemon"]["url"];
            const otherPokemon = this._http.get(url);
            otherPokemon.subscribe(otherPokeData => {
              const otherPokeName = otherPokeData["name"];
              let otherAbilArr: Array<string> = []
              for (let otherAbil of otherPokeData["abilities"]) {
                let dupe: Boolean;
                for (let ownAbil of ownAbilities) {
                  if (otherAbil["ability"]["name"] == ownAbil["ability"]["name"]) {
                    dupe = true;
                  }
                }
                if (!dupe) {
                otherAbilArr.push(otherAbil["ability"]["name"])
                }
              }
              if (otherAbilArr.length) {
              console.log(`${otherPokeName} also knows ${otherAbilArr.join(' and ')}.`)
              }
            })
          }

        })
      }
    })
  }
}
