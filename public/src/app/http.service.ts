import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) {
    this.getPokemon()
    .then(data => this.getPokemonAbilities(data))
    .then(data => this.getPokemonsThatShareAbilities(...data))
    .then(data => this.getOtherPokeAbilities(...data))
    .catch(err => {
      console.log(err)
    })
  }

  getPokemon() {
    return this._http.get('https://pokeapi.co/api/v2/pokemon/1/').toPromise();
  }

  getPokemonAbilities(thisPokeData: Object) {
    const name = thisPokeData["name"];
    let abilData = thisPokeData["abilities"] as Array<Object>
    let abilNameArr: Array<string> = [];
    let abilUrlArr: Array<string> = [];
    abilData.forEach(abil => {
      abilNameArr.push(abil["ability"]["name"]);
      abilUrlArr.push(abil["ability"]["url"]);
    })
    console.log(`${name}'s abilities are ${abilNameArr.join(' and ')}.`)
    const getAbilitiesDataPromise = Promise.all(
      abilUrlArr.map(url => this._http.get(url).toPromise()))
    return Promise.all([
      Promise.resolve(thisPokeData), getAbilitiesDataPromise
    ]);
  }

  getPokemonsThatShareAbilities(thisPokeData: Object, abilitiesData: Array<Object>) {
    let otherPokemons = abilitiesData.map(ability =>
      ability["pokemon"] as Array<Object>
    )
    for (let i in abilitiesData) {
      console.log(
        `${otherPokemons[i].length} other Pokemons share the ability 
        ${abilitiesData[i]["name"]} with this Pokeman ${thisPokeData["name"]}`)
    }
    const getOtherPokeData = []
      .concat(...otherPokemons)
      .map(pokemon => pokemon["pokemon"]["url"])
      .map(url => this._http.get(url).toPromise())
    const getOtherPokeDataPromise = Promise.all(getOtherPokeData)
    return Promise.all([Promise.resolve(thisPokeData), getOtherPokeDataPromise])
  }

  getOtherPokeAbilities(thisPokeData: Object, otherPokeData: Array<Object>) {
    const thisPokeAbility = (thisPokeData["abilities"] as Array<Object>)
      .map(abil => abil["ability"]["name"]);
    const otherPokeAbility = otherPokeData.map(otherPoke => {
      return (otherPoke["abilities"] as Array<Object>)
        .map(abil => abil["ability"]["name"])
        .filter(abilName => !thisPokeAbility.includes(abilName))
    })
    for (let i in otherPokeData) {
      if (otherPokeAbility[i].length) {
        const name = otherPokeData[i]["name"];
        const abilities = otherPokeAbility[i].join(" and ");
        console.log(`${name} also has ${abilities}.`)
      }
    }
    return;
  }

}
