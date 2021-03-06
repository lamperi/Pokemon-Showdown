/*

Ratings and how they work:

-2: Extremely detrimental
      The sort of ability that relegates Pokemon with Uber-level BSTs
      into NU.
    ex. Slow Start, Truant

-1: Detrimental
      An ability that does more harm than good.
    ex. Defeatist, Klutz

 0: Useless
      An ability with no net effect on a Pokemon during a battle.
    ex. Pickup, Illuminate

 1: Ineffective
      An ability that has a minimal effect. Should never be chosen over
      any other ability.
    ex. Pressure, Damp

 2: Situationally useful
      An ability that can be useful in certain situations.
    ex. Blaze, Insomnia

 3: Useful
      An ability that is generally useful.
    ex. Volt Absorb, Iron Fist

 4: Very useful
      One of the most popular abilities. The difference between 3 and 4
      can be ambiguous.
    ex. Technician, Intimidate

 5: Essential
      The sort of ability that defines metagames.
    ex. Drizzle, Magnet Pull

*/

exports.BattleAbilities = {
	"Adaptability": {
		desc: "This Pokemon's attacks that receive STAB (Same Type Attack Bonus) are increased from 50% to 100%.",
		onModifyMove: function(move) {
			move.stab = 2;
		},
		id: "Adaptability",
		name: "Adaptability",
		rating: 3.5,
		num: "91"
	},
	"Aftermath": {
		desc: "If a\u00a0direct attack\u00a0knocks out this Pokemon, the opponent receives damage equal to one-fourth of its max HP.",
		id: "Aftermath",
		name: "Aftermath",
		onFaint: function(target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.isContact && source)
			{
				this.damage(source.maxhp/4, source, target);
			}
		},
		rating: 3,
		num: "106"
	},
	"AirLock": {
		desc: "While this Pokemon is active, all weather conditions and their effects are disabled.",
		onAnyModifyPokemon: function(pokemon) {
			pokemon.ignore['WeatherTarget'] = true;
		},
		id: "AirLock",
		name: "Air Lock",
		rating: 3,
		num: "76"
	},
	"Analytic": {
		desc: "If the user moves after the target, the power of the user's next move is increased by 30%.",
		id: "Analytic",
		name: "Analytic",
		rating: 1,
		num: "??"
	},
	"AngerPoint": {
		desc: "If this Pokemon, or its Substitute, is struck by a Critical Hit, its Attack is boosted by six stages.",
		onCriticalHit: function(target) {
			if (!target.volatiles['Substitute'])
			{
				target.setBoost({atk: 6});
				this.add('residual ability-activate '+target.id+' AngerPoint');
				this.add('r-boost '+target.id+' atk 12');
			}
		},
		id: "AngerPoint",
		name: "Anger Point",
		rating: 2,
		num: "83"
	},
	"Anticipation": {
		desc: "A warning is displayed if an opposing Pokemon has the moves Selfdestruct, Explosion, Fissure, Guillotine, Horn Drill, Sheer Cold or any move from a type that is considered Super Effective against this Pokemon. Hidden Power, Judgment, Natural Gift and Weather Ball are viewed as Normal-type moves; Counter, Mirror Coat and Metal Burst do not receive warnings.",
		id: "Anticipation",
		name: "Anticipation",
		rating: 1,
		num: "107"
	},
	"ArenaTrap": {
		desc: "When this Pokemon enters the field, its opponents cannot switch or flee the battle unless they are part Flying-type, have the Levitate ability, are holding Shed Shell, or they use the moves Baton Pass or U-Turn. Flying-type and Levitate Pokemon cannot escape if they are holding Iron Ball or Gravity is in effect. Levitate Pokemon also cannot escape if their ability is disabled through other means, such as Skill Swap or Gastro Acid. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of wild Pokemon battles is doubled.",
		onFoeModifyPokemon: function(pokemon) {
			if (pokemon.runImmunity('Ground', false))
			{
				pokemon.trapped = true;
			}
		},
		id: "ArenaTrap",
		name: "Arena Trap",
		rating: 5,
		num: "71"
	},
	"BadDreams": {
		desc: "If asleep, each of this Pokemon's opponents receives damage equal to one-eighth of its max HP.",
		onResidualPriority: -26.1,
		onResidual: function(pokemon) {
			for (var i=0; i<pokemon.side.foe.active.length; i++)
			{
				var target = pokemon.side.foe.active[i];
				if (target.status === 'slp')
				{
					this.damage(target.maxhp/8, target);
				}
			}
		},
		id: "BadDreams",
		name: "Bad Dreams",
		rating: 2,
		num: "123"
	},
	"BattleArmor": {
		desc: "Critical Hits cannot strike this Pokemon.",
		onCriticalHit: false,
		id: "BattleArmor",
		name: "Battle Armor",
		rating: 1,
		num: "4"
	},
	"BigPecks": {
		desc: "Prevents the Pok\u00e9mon's Defense stat from being reduced.",
		onBoost: function(boost, target, source) {
			if (source && target === source) return;
			if (boost['def'] && boost['def'] < 0)
			{
				boost['def'] = 0;
			}
		},
		id: "BigPecks",
		name: "Big Pecks",
		rating: 1,
		num: "145"
	},
	"Blaze": {
		desc: "When its health reaches one-third or less of its max HP, this Pokemon's Fire-type attacks receive a 50% boost in power.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp/3)
			{
				this.debug('Blaze boost');
				return basePower * 1.5;
			}
		},
		id: "Blaze",
		name: "Blaze",
		rating: 2,
		num: "66"
	},
	"Chlorophyll": {
		desc: "If this Pokemon is active while Sunny Day is in effect, its speed is temporarily doubled.",
		onModifyStats: function(stats) {
			if (this.weather === 'SunnyDay')
			{
				stats.spe *= 2;
			}
		},
		id: "Chlorophyll",
		name: "Chlorophyll",
		rating: 3.5,
		num: "34"
	},
	"ClearBody": {
		desc: "Opponents cannot reduce this Pokemon's stats; they can, however, modify stat changes with Power Swap, Guard Swap and Heart Swap and inflict stat boosts with Swagger and Flatter. This ability does not prevent self-inflicted stat reductions.",
		onBoost: function(boost, target, source) {
			if (source && target === source) return;
			for (var i in boost)
			{
				if (boost[i] < 0)
				{
					boost[i] = 0;
				}
			}
		},
		id: "ClearBody",
		name: "Clear Body",
		rating: 2,
		num: "29"
	},
	"CloudNine": {
		desc: "While this Pokemon is active, all weather conditions and their effects are disabled.",
		onAnyModifyPokemon: function(pokemon) {
			pokemon.ignore['WeatherTarget'] = true;
		},
		id: "CloudNine",
		name: "Cloud Nine",
		rating: 3,
		num: "13"
	},
	"ColorChange": {
		desc: "This Pokemon's type changes according to the type of the last move that hit this Pokemon.",
		onSecondary: function(target, source, effect) {
			if (effect && effect.effectType === 'Move')
			{
				target.addVolatile('ColorChange', source, effect);
			}
		},
		effect: {
			onStart: function(target, source, effect) {
				this.effectData.type = 'Normal';
				if (effect && effect.type && effect.type !== 'Normal')
				{
					this.add('residual '+target.id+' ability-activate ColorChange '+effect.type);
					this.effectData.type = effect.type;
				}
				else
				{
					return false;
				}
			},
			onRestart: function(target, source, effect) {
				if (effect && effect.type && effect.type !== this.effectData.type)
				{
					this.add('residual '+target.id+' ability-activate ColorChange '+effect.type);
					this.effectData.type = effect.type;
				}
			},
			onModifyPokemon: function(target) {
				if (!this.effectData.type) this.effectData.type = 'Normal';
				target.types = [this.effectData.type];
			}
		},
		id: "ColorChange",
		name: "Color Change",
		rating: 2,
		num: "16"
	},
	"Compoundeyes": {
		desc: "The accuracy of this Pokemon's moves receives a 30% increase; for example, a 75% accurate move becomes 97.5% accurate. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of wild Pokemon holding an item increases.",
		onModifyMove: function(move) {
			if (typeof move.accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			move.accuracy *= 1.3;
		},
		id: "Compoundeyes",
		name: "Compoundeyes",
		rating: 3.5,
		num: "14"
	},
	"Contrary": {
		desc: "Stat changes are inverted.",
		onBoost: function(boost) {
			for (var i in boost)
			{
				boost[i] *= -1;
			}
		},
		id: "Contrary",
		name: "Contrary",
		rating: 4,
		num: "126"
	},
	"CursedBody": {
		desc: "30% chance of disabling one of the opponent's moves when attacked. This works even if the attacker is behind a Substitute, but will not activate if the Pok\u00e9mon with Cursed Body is behind a Substitute.",
		id: "CursedBody",
		name: "Cursed Body",
		rating: 2,
		num: "130"
	},
	"CuteCharm": {
		desc: "If an opponent of the opposite gender\u00a0directly attacks\u00a0this Pokemon, there is a 30% chance that the opponent will become Attracted to this Pokemon. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of wild Pokemon of the opposite gender appearing increases to 66.7%.",
		id: "CuteCharm",
		name: "Cute Charm",
		rating: 2,
		num: "56"
	},
	"Damp": {
		desc: "While this Pokemon is active, no Pokemon on the field can use Selfdestruct or Explosion.",
		id: "Damp",
		onAnyDamage: function(damage, target, source, effect) {
			if (effect && effect.id === 'Aftermath')
			{
				return false;
			}
		},
		name: "Damp",
		rating: 1,
		num: "6"
	},
	"Defeatist": {
		desc: "Attack and Special Attack are halved when HP is less than half.",
		onModifyStats: function(stats, pokemon) {
			if (pokemon.hp < pokemon.maxhp/2)
			{
				stats.atk /= 2;
				stats.spa /= 2;
			}
		},
		onResidual: function(pokemon) {
			pokemon.update();
		},
		id: "Defeatist",
		name: "Defeatist",
		rating: -1,
		num: "129"
	},
	"Defiant": {
		desc: "Raises the user's Attack stat by two stages when a stat is lowered, including the Attack stat. This does not include self-induced stat drops like those from Close Combat.",
		onAfterBoost: function(boost, target, source) {
			if (!source || target === source)
			{
				return;
			}
			var statsLowered = false;
			for (var i in boost)
			{
				if (boost[i] < 0)
				{
					statsLowered = true;
				}
			}
			if (statsLowered)
			{
				this.boost({atk: 2});
			}
		},
		id: "Defiant",
		name: "Defiant",
		rating: 2,
		num: "128"
	},
	"Download": {
		desc: "If this Pokemon switches into an opponent with equal Defenses or higher Defense than Special Defense, this Pokemon's Special Attack receives a 50% boost. If this Pokemon switches into an opponent with higher Special Defense than Defense, this Pokemon's Attack receive a 50% boost.",
		onStart: function (pokemon) {
			var foeactive = pokemon.side.foe.active;
			var totaldef = 0;
			var totalspd = 0;
			for (var i=0; i<foeactive.length; i++)
			{
				if (!foeactive[i]) continue;
				totaldef += foeactive[i].stats.def;
				totalspd += foeactive[i].stats.spd;
			}
			this.add('residual '+pokemon.id+' ability-activate Download');
			if (totaldef >= totalspd)
			{
				this.boost({spa:1});
			}
			else
			{
				this.boost({atk:1});
			}
		},
		id: "Download",
		name: "Download",
		rating: 4,
		num: "88"
	},
	"Drizzle": {
		desc: "When this Pokemon enters the battlefield, it causes a permanent Rain Dance that can only be stopped by Air Lock, Cloud Nine or another weather condition.",
		onStart: function(source) {
			this.setWeather('RainDance');
			this.weatherData.duration = 0;
		},
		id: "Drizzle",
		name: "Drizzle",
		rating: 5,
		num: "2"
	},
	"Drought": {
		desc: "When this Pokemon enters the battlefield, it causes a permanent Sunny Day that can only be stopped by Air Lock, Cloud Nine or another weather condition.",
		onStart: function(source) {
			this.setWeather('SunnyDay');
			this.weatherData.duration = 0;
		},
		id: "Drought",
		name: "Drought",
		rating: 5,
		num: "70"
	},
	"DrySkin": {
		desc: "This Pokemon absorbs Water attacks and gains a weakness to Fire attacks. If Sunny Day is in effect, this Pokemon takes damage. If Rain Dance is in effect, this Pokemon recovers health.",
		onImmunity: function(type, pokemon) {
			if (type === 'Water')
			{
				var d = pokemon.heal(pokemon.maxhp/4);
				this.add('r-ability-heal '+pokemon.id+' DrySkin '+d+pokemon.getHealth());
				return null;
			}
		},
		onFoeBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Fire')
			{
				return basePower * 5/4;
			}
		},
		onWeather: function(target, source, effect) {
			if (effect.id === 'RainDance')
			{
				this.heal(target.maxhp/8);
			}
			else if (effect.id === 'SunnyDay')
			{
				this.damage(target.maxhp/8);
			}
		},
		id: "DrySkin",
		name: "Dry Skin",
		rating: 3,
		num: "87"
	},
	"EarlyBird": {
		desc: "This Pokemon will remain asleep for half as long as it normally would; this includes both opponent-induced sleep and user-induced sleep via Rest.",
		id: "EarlyBird",
		name: "Early Bird",
		isHalfSleep: true,
		rating: 2.5,
		num: "48"
	},
	"EffectSpore": {
		desc: "If an opponent\u00a0directly attacks\u00a0this Pokemon, there is a 30% chance that the opponent will become either poisoned, paralyzed or put to sleep. There is an equal chance to inflict each status.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact)
			{
				var r = Math.random() * 10;
				if (r < 3)
				{
					if (r < 1)
					{
						source.trySetStatus('psn', target, move);
					}
					else if (r < 2)
					{
						source.trySetStatus('par', target, move);
					}
					else
					{
						source.trySetStatus('slp', target, move);
					}
				}
			}
		},
		id: "EffectSpore",
		name: "Effect Spore",
		rating: 2,
		num: "27"
	},
	"Filter": {
		desc: "This Pokemon receives one-fourth reduced damage from Super Effective attacks.",
		onFoeBasePower: function(basePower, attacker, defender, move) {
			if (this.getEffectiveness(move.type, defender) > 0)
			{
				this.debug('Filter neutralize');
				return basePower * 3/4;
			}
		},
		id: "Filter",
		name: "Filter",
		rating: 3,
		num: "111"
	},
	"FlameBody": {
		desc: "If an opponent\u00a0directly attacks\u00a0this Pokemon, there is a 30% chance that the opponent will become burned. [Field Effect]\u00a0Pokemon Eggs hatch in half the time.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact)
			{
				if (Math.random() * 10 < 3)
				{
					source.trySetStatus('brn', target, move);
				}
			}
		},
		id: "FlameBody",
		name: "Flame Body",
		rating: 2,
		num: "49"
	},
	"FlareBoost": {
		desc: "When the user with this ability is burned, its Special Attack is raised by 50%.",
		onModifyStats: function(stats, pokemon) {
			if (pokemon.status === 'brn')
			{
				stats.spa *= 1.5;
			}
		},
		id: "FlareBoost",
		name: "Flare Boost",
		rating: 3,
		num: "138"
	},
	"FlashFire": {
		desc: "This Pokemon is immune to all Fire-type attacks; additionally, its own Fire-type attacks receive a 50% boost if a Fire-type move hits this Pokemon. Multiple boosts do not occur if this Pokemon is hit with multiple Fire-type attacks.",
		onImmunity: function(type, pokemon) {
			if (type === 'Fire')
			{
				pokemon.addVolatile('FlashFire');
				return null;
			}
		},
		effect: {
			onStart: function(target) {
				this.add('r-volatile '+target.id+' flash-fire');
			},
			onBasePower: function(basePower, attacker, defender, move) {
				if (move.type === 'Fire')
				{
					this.debug('Flash Fire boost');
					return basePower * 1.5;
				}
			}
		},
		id: "FlashFire",
		name: "Flash Fire",
		rating: 3,
		num: "18"
	},
	"FlowerGift": {
		desc: "If this Pokemon is active while Sunny Day is in effect, its Attack and Special Defense stats (as well as its partner's stats in double battles) receive a 50% boost.",
		onModifyStats: function(stats, pokemon) {
			if (this.weather === 'SunnyDay')
			{
				stats.atk *= 1.5;
				stats.spd *= 1.5;
			}
		},
		id: "FlowerGift",
		name: "Flower Gift",
		rating: 3,
		num: "122"
	},
	"Forecast": {
		desc: "This Pokemon's type changes according to the current weather conditions: it becomes Fire-type during Sunny Day, Water-type during Rain Dance, Ice-type during Hail and remains its regular type otherwise.",
		onModifyPokemon: function(pokemon) {
			if (pokemon.species !== 'Castform') return;
			if (this.weather === 'SunnyDay')
			{
				pokemon.types = ['Fire'];
			}
			if (this.weather === 'RainDance')
			{
				pokemon.types = ['Water'];
			}
			if (this.weather === 'Hail')
			{
				pokemon.types = ['Ice'];
			}
		},
		id: "Forecast",
		name: "Forecast",
		rating: 4,
		num: "59"
	},
	"Forewarn": {
		desc: "The move with the highest Base Power in the opponent's moveset is revealed.",
		id: "Forewarn",
		name: "Forewarn",
		rating: 1,
		num: "108"
	},
	"FriendGuard": {
		desc: "Reduces the damage received from an ally in a double or triple battle.",
		id: "FriendGuard",
		name: "Friend Guard",
		rating: 0,
		num: "132"
	},
	"Frisk": {
		desc: "When this Pokemon enters the field, it identifies the opponent's held item; in double battles, the held item of an unrevealed, randomly selected opponent is identified.",
		onStart: function(pokemon) {
			var target = pokemon.side.foe.randomActive();
			this.add('message Frisk found '+target.item+'. (placeholder)');
		},
		id: "Frisk",
		name: "Frisk",
		rating: 1.5,
		num: "119"
	},
	"Gluttony": {
		desc: "This Pokemon consumes its held berry when its health reaches 50% max HP or lower.",
		id: "Gluttony",
		name: "Gluttony",
		rating: 1.5,
		num: "82"
	},
	"Guts": {
		desc: "When this Pokemon is poisoned (including Toxic), burned, paralyzed or asleep (including self-induced Rest), its Attack stat receives a 50% boost; the burn status' Attack drop is also ignored.",
		onModifyStats: function(stats, pokemon) {
			if (pokemon.status)
			{
				stats.atk *= 1.5;
			}
		},
		id: "Guts",
		name: "Guts",
		rating: 4,
		num: "62"
	},
	"Harvest": {
		desc: "When the user uses a held Berry, it is restored at the end of the turn.",
		id: "Harvest",
		name: "Harvest",
		onResidualPriority: -26.1,
		rating: 4,
		num: "139"
	},
	"Healer": {
		desc: "Has a 30% chance of curing an adjacent ally's status ailment at the end of each turn in Double and Triple Battles.",
		id: "Healer",
		name: "Healer",
		rating: 0,
		num: "131"
	},
	"Heatproof": {
		desc: "This Pokemon receives half damage from both Fire-type attacks and residual burn damage.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Fire')
			{
				return basePower / 2;
			}
		},
		id: "Heatproof",
		name: "Heatproof",
		rating: 2.5,
		num: "85"
	},
	"HeavyMetal": {
		desc: "The user's weight is doubled. This increases user's base power of Heavy Bomber, as well as damage taken from the opponent's Low Kick and Grass Knot, due to these moves being calculate by the target's weight.",
		onModifyPokemon: function(pokemon) {
			pokemon.weightkg *= 2;
		},
		id: "HeavyMetal",
		name: "Heavy Metal",
		rating: 0,
		num: "134"
	},
	"HoneyGather": {
		desc: "If it is not already holding an item, this Pokemon may find and be holding Honey after a battle.",
		id: "HoneyGather",
		name: "Honey Gather",
		rating: 0,
		num: "118"
	},
	"HugePower": {
		desc: "This Pokemon's Attack stat is doubled. Therefore, if this Pokemon's Attack stat on the status screen is 200, it effectively has an Attack stat of 400; which is then subject to the full range of stat boosts and reductions.",
		onModifyStats: function(stats) {
			stats.atk *= 2;
		},
		id: "HugePower",
		name: "Huge Power",
		rating: 5,
		num: "37"
	},
	"Hustle": {
		desc: "This Pokemon's Attack receives a 50% boost but its Physical attacks receive a 20% drop in Accuracy. For example, a 100% accurate move would become an 80% accurate move. The accuracy of moves that never miss, such as Aerial Ace, remains unaffected. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of wild Pokemon battles decreases.",
		onModifyStats: function(stats) {
			stats.atk *= 1.5;
		},
		onModifyMove: function(move) {
			if (move.category === 'Physical' && typeof move.accuracy === 'number')
			{
				move.accuracy *= .8;
			}
		},
		id: "Hustle",
		name: "Hustle",
		rating: 3,
		num: "55"
	},
	"Hydration": {
		desc: "If this Pokemon is active while Rain Dance is in effect, it recovers from poison, paralysis, burn, sleep and freeze at the end of the turn.",
		onWeather: function(pokemon) {
			if (pokemon.status && this.weather === 'RainDance')
			{
				this.debug('hydration');
				pokemon.cureStatus();
			}
		},
		id: "Hydration",
		name: "Hydration",
		rating: 4,
		num: "93"
	},
	"HyperCutter": {
		desc: "Opponents cannot reduce this Pokemon's Attack stat; they can, however, modify stat changes with Power Swap or Heart Swap and inflict a stat boost with Swagger. This ability does not prevent self-inflicted stat reductions.",
		onBoost: function(boost, target, source) {
			if (source && target === source) return;
			if (boost['atk'] && boost['atk'] < 0)
			{
				boost['atk'] = 0;
			}
		},
		id: "HyperCutter",
		name: "Hyper Cutter",
		rating: 2,
		num: "52"
	},
	"IceBody": {
		desc: "If active while Hail is in effect, this Pokemon recovers one-sixteenth of its max HP after each turn. If a non-Ice-type Pokemon receives this ability through Skill Swap, Role Play or the Trace ability, it will not take damage from Hail.",
		onWeather: function(target, source, effect) {
			if (effect.id === 'Hail')
			{
				this.heal(target.maxhp/16);
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'Hail') return false;
		},
		id: "IceBody",
		name: "Ice Body",
		rating: 3,
		num: "115"
	},
	"Illuminate": {
		desc: "When this Pokemon is in the first slot of the player's party, it doubles the rate of wild encounters.",
		id: "Illuminate",
		name: "Illuminate",
		rating: 0,
		num: "35"
	},
	"Illusion": {
		desc: "Illusion will change the appearance of the Pok\u00e9mon to a different species. This is dependent on the last Pok\u00e9mon in the player's party. Along with the species itself, Illusion is broken when the user is damaged, but is not broken by Substitute, weather conditions, status ailments, or entry hazards. Illusion will replicate the type of Pok\u00e9 Ball, the species name, and the gender of the Pok\u00e9mon it is masquerading as.",
		onModifyPokemon: function(pokemon) {
			if (!pokemon.volatiles['Illusion'])
			{
				for (i=pokemon.side.pokemon.length-1; i>pokemon.position; i--)
				{
					if (!pokemon.side.pokemon[i]) continue;
					if (!pokemon.side.pokemon[i].fainted) break;
				}
				pokemon.id = pokemon.side.pokemon[i].id;
				pokemon.fullid = pokemon.side.pokemon[i].fullid;
			}
		},
		onDamage: function(damage, pokemon, source, effect) {
			if (effect && effect.effectType === 'Move')
			{
				this.debug('illusion cleared');
				pokemon.addVolatile('Illusion');
				pokemon.id = pokemon.baseId;
				pokemon.fullid = pokemon.baseFullid;
				this.add('pokemon '+pokemon.fullid);
				this.add('replace '+pokemon.id);
			}
		},
		id: "Illusion",
		name: "Illusion",
		rating: 4.5,
		num: "149"
	},
	"Immunity": {
		desc: "This Pokemon cannot become poisoned nor Toxic poisoned.",
		onImmunity: function(type) {
			if (type === 'psn') return false;
		},
		id: "Immunity",
		name: "Immunity",
		rating: 1,
		num: "17"
	},
	"Imposter": {
		desc: "As soon as the user comes into battle, it Transforms into its opponent, copying the opponent's stats exactly, with the exception of HP. Eccentric copies all stat changes on the target originating from moves and abilities such as Swords Dance and Inweak-kneedate, but not from items such as Choice Specs. Eccentric will not Transform the user if the opponent is an Illusion or if the opponent is behind a Substitute.",
		onStart: function(pokemon) {
			var target = pokemon.side.foe.randomActive();
			if (pokemon.transformInto(target))
			{
				this.add('r-transform '+pokemon.id+' '+target.id);
			}
		},
		id: "Imposter",
		name: "Imposter",
		rating: 5,
		num: "150"
	},
	"Infiltrator": {
		desc: "Ignores Reflect, Light Screen and Safeguard under effect on the target.",
		id: "Infiltrator",
		name: "Infiltrator",
		rating: 1,
		num: "151"
	},
	"InnerFocus": {
		desc: "This Pokemon cannot be made to flinch.",
		onFlinch: false,
		id: "InnerFocus",
		name: "Inner Focus",
		rating: 1,
		num: "39"
	},
	"Insomnia": {
		desc: "This Pokemon cannot be put to sleep; this includes both opponent-induced sleep as well as user-induced sleep via Rest.",
		onImmunity: function(type, pokemon) {
			if (type === 'slp') return false;
		},
		id: "Insomnia",
		name: "Insomnia",
		rating: 2,
		num: "15"
	},
	"Intimidate": {
		desc: "When this Pokemon enters the field, the Attack stat of each of its opponents lowers by one stage. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of wild Pokemon battles, whose level is at least 5 levels less than that of this Pokemon, halves.",
		onStart: function(pokemon) {
			var foeactive = pokemon.side.foe.active;
			for (var i=0; i<foeactive.length; i++)
			{
				if (!foeactive[i]) continue;
				if (foeactive[i].volatiles['Substitute'])
				{
					// does it give a message?
					this.add('r-sub-block '+foeactive[i].id+' Intimidate');
				}
				else
				{
					this.add('r-intimidate '+pokemon.id+' '+foeactive[i].id);
					this.boost({atk: -1}, foeactive[i]);
				}
			}
		},
		id: "Intimidate",
		name: "Intimidate",
		rating: 4,
		num: "22"
	},
	"IronBarbs": {
		desc: "All moves that make contact with the Pok\u00e9mon with Iron Barbs will damage the user by 1/8 of their maximum HP after damage is dealt.",
		onAfterMoveSecondary: function(target, source, move) {
			if (source && source !== target && move && move.isContact)
			{
				this.damage(source.maxhp/8, source, target);
			}
		},
		id: "IronBarbs",
		name: "Iron Barbs",
		rating: 3,
		num: "160"
	},
	"IronFist": {
		desc: "This Pokemon receives a 20% power boost for the following attacks: Bullet Punch, Comet Punch, Dizzy Punch, Drain Punch, Dynamicpunch, Fire Punch, Focus Punch, Hammer Arm, Ice Punch, Mach Punch, Mega Punch, Meteor Mash, Shadow Punch, Sky Uppercut, and Thunderpunch. Sucker Punch, which is known Ambush in Japan, is\u00a0not boosted.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.isPunchAttack)
			{
				this.debug('Iron Fist boost');
				return basePower * 12/10;
			}
		},
		id: "IronFist",
		name: "Iron Fist",
		rating: 3,
		num: "89"
	},
	"Justified": {
		desc: "Will raise the user's Attack stat one level when hit by any Dark-type moves. Unlike other abilities with immunity to certain typed moves, the user will still receive damage from the attack. Righteous Heart will raise Attack one level for each hit of a multi-hit move like Beat Up.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.type === 'Dark')
			{
				this.boost({atk:1});
			}
		},
		id: "Justified",
		name: "Justified",
		rating: 2,
		num: "154"
	},
	"KeenEye": {
		desc: "This Pokemon's Accuracy cannot be lowered. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of low-leveled wild Pokemon battles decreases.",
		onBoost: function(boost, target, source) {
			if (source && target === source) return;
			if (boost['accuracy'] && boost['accuracy'] < 0)
			{
				boost['accuracy'] = 0;
			}
		},
		id: "KeenEye",
		name: "Keen Eye",
		rating: 1,
		num: "51"
	},
	"Klutz": {
		desc: "This Pokemon ignores both the positive and negative effects of its held item, other than the speed-halving effects of Iron Ball and the seven EV training items.",
		onModifyPokemon: function(pokemon) {
			pokemon.ignore['Item'] = true;
		},
		id: "Klutz",
		name: "Klutz",
		rating: 1.5,
		num: "103"
	},
	"LeafGuard": {
		desc: "If this Pokemon is active while Sunny Day is in effect, it cannot become poisoned, burned, paralyzed or put to sleep (other than user-induced Rest). Leaf Guard does not heal status effects that existed before Sunny Day came into effect.",
		onSetStatus: function(pokemon) {
			if (this.weather === 'SunnyDay')
			{
				this.debug('interrupting setstatus');
				return false;
			}
		},
		id: "LeafGuard",
		name: "Leaf Guard",
		rating: 3,
		num: "102"
	},
	"Levitate": {
		desc: "This Pokemon is immune to Ground-type attacks, Spikes, Toxic Spikes and the Arena Trap ability; it loses these immunities while holding Iron Ball, after using Ingrain or if Gravity is in effect.",
		onImmunity: function(type) {
			if (type === 'Ground') return false;
		},
		id: "Levitate",
		name: "Levitate",
		rating: 3.5,
		num: "26"
	},
	"LightMetal": {
		desc: "The user's weight is halved. This decreases the damage taken from Low Kick and Grass Knot, and also lowers user's base power of Heavy Bomber, due these moves being calculated by the target and user's weight.",
		onModifyPokemon: function(pokemon) {
			pokemon.weightkg /= 2;
		},
		id: "LightMetal",
		name: "Light Metal",
		rating: 1,
		num: "135"
	},
	"Lightningrod": {
		desc: "During double battles, this Pokemon draws\u00a0any\u00a0single-target Electric-type attack to itself. If an opponent uses an Electric-type attack that affects multiple Pokemon, those targets will be hit. This ability does not affect Electric Hidden Power or Judgment. The user is immune to Electric and its Special Attack is increased one stage when hit by one.",
		onImmunity: function(type, pokemon) {
			if (type === 'Electric')
			{
				this.boost({spa:1});
				return null;
			}
		},
		id: "Lightningrod",
		name: "Lightningrod",
		rating: 3,
		num: "32"
	},
	"Limber": {
		desc: "This Pokemon cannot become paralyzed.",
		onImmunity: function(type, pokemon) {
			if (type === 'par') return false;
		},
		id: "Limber",
		name: "Limber",
		rating: 2,
		num: "7"
	},
	"LiquidOoze": {
		desc: "When another Pokemon uses Absorb, Drain Punch, Dream Eater, Giga Drain, Leech Life, Leech Seed or Mega Drain against this Pokemon, the attacking Pokemon loses the amount of health that it would have gained.",
		id: "LiquidOoze",
		name: "Liquid Ooze",
		rating: 1,
		num: "64"
	},
	"MagicBounce": {
		desc: "It can reflect the effect of status moves.",
		id: "MagicBounce",
		name: "Magic Bounce",
		onAllyFieldHit: function(target, source, move) {
			if (target === source) return;
			if (typeof move.isBounceable === 'undefined')
			{
				move.isBounceable = !!(move.status || move.forceSwitch);
			}
			if (move.target !== 'foeSide' && target !== this.effectData.target)
			{
				return;
			}
			if (this.pseudoWeather['MagicBounce'])
			{
				return;
			}
			if (move.isBounceable)
			{
				this.addPseudoWeather('MagicBounce');
				this.add('r-bounce-back '+source.id+' MagicBounce '+move.id+' '+target.id);
				this.moveHit(source, target, move);
				return null;
			}
		},
		effect: {
			duration: 1
		},
		rating: 5,
		num: "156"
	},
	"MagicGuard": {
		desc: "Prevents all damage except from direct attacks.",
		onDamage: function(damage, target, source, effect) {
			if (effect.effectType !== 'Move')
			{
				return false;
			}
		},
		id: "MagicGuard",
		name: "Magic Guard",
		rating: 4.5,
		num: "98"
	},
	"MagmaArmor": {
		desc: "This Pokemon cannot become frozen. [Field Effect]\u00a0Pokemon Eggs hatch in half the time",
		onImmunity: function(type, pokemon) {
			if (type === 'frz') return false;
		},
		id: "MagmaArmor",
		name: "Magma Armor",
		rating: 0.5,
		num: "40"
	},
	"MagnetPull": {
		desc: "When this Pokemon enters the field, Steel-type opponents cannot switch out nor flee the battle unless they are holding Shed Shell or use the attacks U-Turn or Baton Pass. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of encountering a Steel-type Pokemon increases by 50%.",
		onFoeModifyPokemon: function(pokemon) {
			if (pokemon.hasType('Steel'))
			{
				pokemon.trapped = true;
			}
		},
		id: "MagnetPull",
		name: "Magnet Pull",
		rating: 5,
		num: "42"
	},
	"MarvelScale": {
		desc: "When this Pokemon becomes burned, poisoned (including Toxic), paralyzed, frozen or put to sleep (including self-induced sleep via Rest), its Defense receives a 50% boost.",
		onModifyStats: function(stats, pokemon) {
			if (pokemon.status)
			{
				stats.def *= 1.5;
			}
		},
		id: "MarvelScale",
		name: "Marvel Scale",
		rating: 3,
		num: "63"
	},
	"Minus": {
		desc: "This Pokemon's Special Attack receives a 50% boost in double battles if its partner has the Plus ability.",
		id: "Minus",
		name: "Minus",
		rating: 0,
		num: "58"
	},
	"MoldBreaker": {
		desc: "When this Pokemon becomes active, it nullifies the abilities of opposing active Pokemon that hinder this Pokemon's attacks. These abilities include Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Herbivore, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightningrod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke and Wonder Guard.",
		onStart: function(pokemon) {
			this.add('message '+pokemon.name+' has Mold Breaker. (placeholder)');
		},
		onAllyModifyPokemonPriority: 100,
		onAllyModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target && pokemon !== this.activePokemon)
			{
				pokemon.ignore['Ability'] = 'A';
			}
		},
		onFoeModifyPokemonPriority: 100,
		onFoeModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target)
			{
				pokemon.ignore['Ability'] = 'A';
			}
		},
		id: "MoldBreaker",
		name: "Mold Breaker",
		rating: 3,
		num: "104"
	},
	"Moody": {
		desc: "Causes the Pok\u00e9mon to raise one of its stats by two stages, while another stat is lowered by one stage at the end of each turn. These stats include accuracy and evasion.",
		onResidualPriority: -26.1,
		onResidual: function(pokemon) {
			var stats = [], i = '';
			var boost = {};
			for (var i in pokemon.boosts)
			{
				if (pokemon.boosts[i] < 6)
				{
					stats.push(i);
				}
			}
			if (stats.length)
			{
				i = stats[parseInt(Math.random()*stats.length)];
				boost[i] = 2;
			}
			stats = [];
			for (var j in pokemon.boosts)
			{
				if (pokemon.boosts[j] > -6 && j !== i)
				{
					stats.push(j);
				}
			}
			if (stats.length)
			{
				i = stats[parseInt(Math.random()*stats.length)];
				boost[i] = -1;
			}
			this.boost(boost);
		},
		id: "Moody",
		name: "Moody",
		rating: 5,
		num: "141"
	},
	"MotorDrive": {
		desc: "This Pokemon is immune to all Electric-type attacks, including Thunder Wave, and if an Electric-type attack hits this Pokemon, it receives a one-level Speed boost.",
		onImmunity: function(type, pokemon) {
			if (type === 'Electric')
			{
				this.boost({spe:1});
				return null;
			}
		},
		id: "MotorDrive",
		name: "Motor Drive",
		rating: 3,
		num: "78"
	},
	"Moxie": {
		desc: "When a Pok\u00e9mon with Moxie faints another Pok\u00e9mon, its Attack rises by one stage.",
		onSourceFaint: function(target, source, effect) {
			if (effect && effect.effectType === 'Move')
			{
				this.boost({atk:1}, source);
			}
		},
		id: "Moxie",
		name: "Moxie",
		rating: 4,
		num: "153"
	},
	"Multiscale": {
		desc: "Lowers damage taken by half when at maximum HP.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (defender.hp >= defender.maxhp)
			{
				this.debug('Multiscale weaken');
				return basePower/2;
			}
		},
		id: "Multiscale",
		name: "Multiscale",
		rating: 4,
		num: "136"
	},
	"Multitype": {
		desc: "This Pokemon changes its type to match its\u00a0corresponding held Plate; this ability only works for Arceus, prevents the removal of Arceus' held item and cannot be Skill Swapped, Role Played or Traced.",
		onModifyPokemon: function(pokemon) {
			var type = this.runEvent('Plate', pokemon);
			if (type && type !== true)
			{
				pokemon.types = [type];
			}
		},
		id: "Multitype",
		name: "Multitype",
		rating: 5,
		num: "121"
	},
	"Mummy": {
		desc: "When the user is attacked by a contact move or attacks with a contact move, the opposing Pokemon's ability is turned into Mummy as well. Multitype, Wonder Guard and Mummy itself are the only abilities not affected by Mummy. The effect of Mummy is not removed by Mold Breaker, Turboblaze, or Teravolt.",
		id: "Mummy",
		name: "Mummy",
		rating: 1,
		num: "152"
	},
	"NaturalCure": {
		desc: "When this Pokemon switches out of battle, it is cured of poison (including Toxic), paralysis, burn, freeze and sleep (including self-induced Rest).",
		onSwitchOut: function(pokemon) {
			pokemon.setStatus('');
		},
		id: "NaturalCure",
		name: "Natural Cure",
		rating: 4,
		num: "30"
	},
	"NoGuard": {
		desc: "Both this Pokemon and the opponent will have 100% accuracy for any attack. [Field Effect]\u00a0If Pokemon is in the lead slot, wild encounters will increase.",
		onModifyMove: function(move) {
			move.accuracy = true;
			move.alwaysHit = true;
		},
		onSourceModifyMove: function(move) {
			move.accuracy = true;
			move.alwaysHit = true;
		},
		id: "NoGuard",
		name: "No Guard",
		rating: 4.1,
		num: "99"
	},
	"Normalize": {
		desc: "Makes all of this Pokemon's attacks Normal-typed.",
		onModifyMove: function(move) {
			move.type = 'Normal';
		},
		id: "Normalize",
		name: "Normalize",
		rating: -1,
		num: "96"
	},
	"Oblivious": {
		desc: "This Pokemon cannot become attracted to another Pokemon.",
		id: "Oblivious",
		name: "Oblivious",
		rating: 0.5,
		num: "12"
	},
	"Overcoat": {
		desc: "In battle, the Pok\u00e9mon does not take damage from weather conditions like Sandstorm or Hail.",
		onImmunity: function(type, pokemon) {
			if (type === 'Sandstorm' || type === 'Hail') return false;
		},
		id: "Overcoat",
		name: "Overcoat",
		rating: 1,
		num: "142"
	},
	"Overgrow": {
		desc: "When its health reaches one-third or less of its max HP, this Pokemon's Grass-type attacks receive a 50% boost in power.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp/3)
			{
				this.debug('Overgrow boost');
				return basePower * 1.5;
			}
		},
		id: "Overgrow",
		name: "Overgrow",
		rating: 2,
		num: "65"
	},
	"OwnTempo": {
		desc: "This Pokemon cannot become confused.",
		onImmunity: function(type, pokemon) {
			if (type === 'confusion') return false;
		},
		id: "OwnTempo",
		name: "Own Tempo",
		rating: 1,
		num: "20"
	},
	"Pickup": {
		desc: "If an opponent uses a consumable item, Pickup will give the Pokemon the item used, if it is not holding an item. If multiple Pickup Pokemon are in play, one will pick up a copy of the used Berry, and may or may not use it immediately. Works on Berries, Jewels, Bulb, Focus Sash, Herbs, Rechargeable Battery, Red Card, and anything that is thrown with Fling",
		id: "Pickup",
		name: "Pickup",
		rating: 0,
		num: "53"
	},
	"Pickpocket": {
		desc: "Steals attacking Pok\u00e9mon's held item on contact.",
		id: "Pickpocket",
		name: "Pickpocket",
		rating: 1,
		num: "124"
	},
	"Plus": {
		desc: "This Pokemon's Special Attack receives a 50% boost in double battles if its partner has the Minus ability.",
		id: "Plus",
		name: "Plus",
		rating: 0,
		num: "57"
	},
	"PoisonHeal": {
		desc: "If this Pokemon become poisoned or Toxic Poisoned, it will\u00a0recover\u00a0one-eighth of its max HP after each turn. However, this Pokemon will continue to lose health as the player walks on the overworld screen.",
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox')
			{
				this.heal(target.maxhp/8);
				return false;
			}
		},
		id: "PoisonHeal",
		name: "Poison Heal",
		rating: 4,
		num: "90"
	},
	"PoisonPoint": {
		desc: "If an opponent\u00a0directly attacks\u00a0this Pokemon, there is a 30% chance that the opponent will become poisoned.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact)
			{
				if (Math.random() * 10 < 3)
				{
					source.trySetStatus('psn', target, move);
				}
			}
		},
		id: "PoisonPoint",
		name: "Poison Point",
		rating: 2,
		num: "38"
	},
	"PoisonTouch": {
		desc: "The contact-based attacks from a Pok\u00e9mon with PoisonTouch have a 30% chance of poisoning the target.",
		id: "PoisonTouch",
		name: "Poison Touch",
		rating: 2,
		num: "143"
	},
	"Prankster": {
		desc: "Increases the priority of non-damaging moves by 1.",
		onModifyPriority: function(priority, pokemon, target, move) {
			if (move && move.category === 'Status')
			{
				return priority + 1;
			}
			return priority;
		},
		id: "Prankster",
		name: "Prankster",
		rating: 4,
		num: "158"
	},
	"Pressure": {
		desc: "When an opponent uses a move that affects this Pokemon, an additional PP is required for the opponent to use that move. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of wild Pokemon battles is halved.",
		onStart: function(pokemon) {
			this.add('message '+pokemon.name+' has Pressure. (placeholder)');
		},
		id: "Pressure",
		name: "Pressure",
		rating: 1,
		num: "46"
	},
	"PurePower": {
		desc: "This Pokemon's Attack stat is doubled. Therefore, if this Pokemon's Attack stat on the status screen is 200, it effectively has an Attack stat of 400; which is then subject to the full range of stat boosts and reductions.",
		onModifyStats: function(stats) {
			stats.atk *= 2;
		},
		id: "PurePower",
		name: "Pure Power",
		rating: 5,
		num: "74"
	},
	"QuickFeet": {
		desc: "When this Pokemon is poisoned (including Toxic), burned, paralyzed, asleep (including self-induced Rest) or frozen, its Speed stat receives a 50% boost; the paralysis status' Speed drop is also ignored. [Field Effect]\u00a0If Pokemon is in lead slot, wild encounters decrease.",
		onModifyStats: function(stats, pokemon) {
			if (pokemon.status)
			{
				stats.spe *= 1.5;
			}
		},
		id: "QuickFeet",
		name: "Quick Feet",
		rating: 3,
		num: "95"
	},
	"RainDish": {
		desc: "If active while Rain Dance is in effect, this Pokemon recovers one-sixteenth of its max HP after each turn.",
		onWeather: function(target, source, effect) {
			if (effect.id === 'RainDance')
			{
				this.heal(target.maxhp/16);
			}
		},
		id: "RainDish",
		name: "Rain Dish",
		rating: 3,
		num: "44"
	},
	"Rattled": {
		desc: "Raises the user's Speed one stage when hit by a Dark-, Bug-, or Ghost-type move.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && (effect.type === 'Dark' || effect.type === 'Bug' || effect.type === 'Ghost'))
			{
				this.boost({spe:1});
			}
		},
		id: "Rattled",
		name: "Rattled",
		rating: 2,
		num: "155"
	},
	"Reckless": {
		desc: "When this Pokemon uses an attack that causes recoil damage, or an attack that has a chance to cause recoil damage such as Jump Kick and Hi Jump Kick, the attacks's power receives a 20% boost.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCustomRecoil)
			{
				this.debug('Reckless boost');
				return basePower * 12/10;
			}
		},
		id: "Reckless",
		name: "Reckless",
		rating: 3,
		num: "120"
	},
	"Regenerator": {
		desc: "Causes the user to restore HP by 1/3 of its maximum when switching out.",
		onSwitchOut: function(pokemon) {
			pokemon.heal(pokemon.maxhp/3);
		},
		id: "Regenerator",
		name: "Regenerator",
		rating: 4.5,
		num: "144"
	},
	"Rivalry": {
		desc: "Increases base power of Physical and Special attacks by 25% if the opponent is the same gender, but decreases base power by 25% if opponent is the opposite gender.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender)
			{
				if (attacker.gender === defender.gender)
				{
					this.debug('Rivalry boost');
					return basePower * 5/4;
				}
				else
				{
					this.debug('Rivalry weaken');
					return basePower * 3/4;
				}
			}
		},
		id: "Rivalry",
		name: "Rivalry",
		rating: 2.5,
		num: "79"
	},
	"RockHead": {
		desc: "This Pokemon does not receive recoil damage unless it uses Struggle, it misses with Jump Kick or Hi Jump Kick or it is holding Life Orb, Jaboca Berry or Rowap Berry.",
		onModifyMove: function(move) {
			delete move.recoil;
		},
		id: "RockHead",
		name: "Rock Head",
		rating: 3.5,
		num: "69"
	},
	"RoughSkin": {
		desc: "Causes recoil damage equal to 1/8 of the opponent's max HP if an opponent\u00a0directly attacks.",
		onAfterMoveSecondary: function(target, source, move) {
			if (source && source !== target && move && move.isContact)
			{
				this.damage(source.maxhp/8, source, target);
			}
		},
		id: "RoughSkin",
		name: "Rough Skin",
		rating: 3,
		num: "24"
	},
	"RunAway": {
		desc: "Unless this Pokemon is under the effects of a trapping move or ability, such as Mean Look or Shadow Tag, it will escape from wild Pokemon battles without fail.",
		id: "RunAway",
		name: "Run Away",
		rating: 0,
		num: "50"
	},
	"SandForce": {
		desc: "Raises the power of Rock, Ground, and Steel-type moves by 30% while a Sandstorm is in effect. It also gives the user immunity to damage from Sandstorm.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (this.weather === 'Sandstorm')
			{
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel')
				{
					this.debug('Sand Force boost');
					return basePower * 13/10;
				}
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'Sandstorm') return false;
		},
		id: "SandForce",
		name: "Sand Force",
		rating: 3,
		num: "159"
	},
	"SandRush": {
		desc: "Doubles Speed in a Sandstorm, and makes the Pok\u00e9mon immune to Sandstorm damage.",
		onModifyStats: function(stats, pokemon) {
			if (this.weather === 'Sandstorm')
			{
				stats.spe *= 2;
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'Sandstorm') return false;
		},
		id: "SandRush",
		name: "Sand Rush",
		rating: 3.5,
		num: "146"
	},
	"SandStream": {
		desc: "When this Pokemon enters the battlefield, it causes a permanent Sandstorm that can only be stopped by Air Lock, Cloud Nine or another weather condition.",
		onStart: function(source) {
			this.setWeather('Sandstorm');
			this.weatherData.duration = 0;
		},
		id: "SandStream",
		name: "Sand Stream",
		rating: 5,
		num: "45"
	},
	"SandVeil": {
		desc: "If active while Sandstorm is in effect, this Pokemon's Evasion receives a 20% boost; if this Pokemon has a typing that would normally take damage from Sandstorm, this Pokemon is also immune to Sandstorm's damage. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of wild Pokemon battles during a Sandstorm is halved.",
		onImmunity: function(type, pokemon) {
			if (type === 'Sandstorm') return false;
		},
		onSourceModifyMove: function(move) {
			if (typeof move.accuracy !== 'number') return;
			if (this.weather === 'Sandstorm')
			{	
				this.debug('sand veil - decreasing accuracy');
				move.accuracy *= 0.8;
			}
		},
		id: "SandVeil",
		name: "Sand Veil",
		rating: 3,
		num: "8"
	},
	"SapSipper": {
		desc: "When a Pok\u00e9mon with Sap Sipper is hit with a Grass-type attack, its attack is increased by one level, and the move itself has no effect. If hit by a multi-hit attack like Bullet Seed, it will increase attack by one stage for each hit. The only Grass-type move that will not activate Sap Sipper is Aromatherapy.",
		onImmunity: function(type, pokemon) {
			if (type === 'Grass')
			{
				this.boost({atk:1});
				return null;
			}
		},
		id: "SapSipper",
		name: "Sap Sipper",
		rating: 3,
		num: "157"
	},
	"Scrappy": {
		desc: "This Pokemon has the ability to hit Ghost-type Pokemon with Normal-type and Fighting-type moves. Effectiveness of these moves takes into account the Ghost-type Pokemon's other weaknesses and resistances.",
		onFoeModifyPokemon: function(pokemon) {
			if (pokemon.hasType('Ghost'))
			{
				pokemon.negateImmunity['Normal'] = true;
				pokemon.negateImmunity['Fighting'] = true;
			}
		},
		id: "Scrappy",
		name: "Scrappy",
		rating: 3,
		num: "113"
	},
	"SereneGrace": {
		desc: "The side effects of this Pokemon's attack occur twice as often. For example, if this Pokemon uses Ice Beam, it will have a 20% chance to freeze its target.",
		onModifyMove: function(move) {
			if (move.secondary)
			{
				this.debug('doubling secondary chance');
				move.secondary.chance *= 2;
			}
		},
		id: "SereneGrace",
		name: "Serene Grace",
		rating: 4,
		num: "32"
	},
	"ShadowTag": {
		desc: "When this Pokemon enters the field, its opponents cannot switch or flee the battle unless they have the same ability, are holding Shed Shell, or they use the moves Baton Pass or U-Turn.",
		onFoeModifyPokemon: function(pokemon) {
			if (pokemon.ability !== 'ShadowTag')
			{
				pokemon.trapped = true;
			}
		},
		id: "ShadowTag",
		name: "Shadow Tag",
		rating: 5,
		num: "23"
	},
	"ShedSkin": {
		desc: "After each turn, this Pokemon has a 33% chance to heal itself from poison (including Toxic), paralysis, burn, freeze or sleep (including self-induced Rest).",
		onResidual: function(pokemon) {
			if (pokemon.status && Math.random()*3 < 1)
			{
				this.debug('shed skin');
				pokemon.cureStatus();
			}
		},
		id: "ShedSkin",
		name: "Shed Skin",
		rating: 3,
		num: "61"
	},
	"SheerForce": {
		desc: "Raises the base power of all moves that have any secondary effects by 30%, but the secondary effects are ignored. However, this ability is not applied to moves that have a negative effect on the user, such as recoil, two-turn moves, and stat reduction after using certain moves. If a Pok\u00e9mon with Sheer Force is holding a Life Orb and uses an attack that would be boosted by Sheer Force, then the move gains both boosts but the user receives no recoil damage.",
		onModifyMove: function(move) {
			if (move.secondary)
			{
				this.debug('Sheer Force boost');
				if (!move.basePowerModifier) move.basePowerModifier = 1;
				move.basePowerModifier *= 13/10;
				delete move.secondary;
				move.negateSecondary = true;
			}
		},
		id: "SheerForce",
		name: "Sheer Force",
		rating: 4,
		num: "125"
	},
	"ShellArmor": {
		desc: "Critical Hits cannot strike this Pokemon.",
		onCriticalHit: false,
		id: "ShellArmor",
		name: "Shell Armor",
		rating: 1,
		num: "75"
	},
	"ShieldDust": {
		desc: "If the opponent uses a move that has secondary effects that affect this Pokemon in addition to damage, the move's secondary effects will not trigger. (For example, an Ice Beam will lose its 10% chance to freeze this Pokemon.)",
		onSourceModifyMove: function(move) {
			if (move.secondary)
			{
				this.debug('Shield Dust remove secondary');
				delete move.secondary;
			}
		},
		id: "ShieldDust",
		name: "Shield Dust",
		rating: 2,
		num: "19"
	},
	"Simple": {
		desc: "This Pokemon doubles all of its positive and negative stat modifiers. For example, if this Pokemon uses Curse, its Attack and Defense stats each receive a two-level increase while its Speed stat receives a two-level decrease.",
		onBoost: function(boost) {
			for (var i in boost)
			{
				boost[i] *= 2;
			}
		},
		id: "Simple",
		name: "Simple",
		rating: 4,
		num: "86"
	},
	"SkillLink": {
		desc: "When this Pokemon uses an attack that strikes multiple times in one turn, such as Fury Attack or Spike Cannon, such attacks will always strike for the maximum number of hits.",
		onModifyMove: function(move) {
			if (move.multihit && move.multihit.length)
			{
				move.multihit = move.multihit[1];
			}
		},
		id: "SkillLink",
		name: "Skill Link",
		rating: 4,
		num: "92"
	},
	"SlowStart": {
		desc: "After this Pokemon switches into the battle, its Attack and Speed stats are halved for five turns; for example, if this Pokemon has an Attack stat of 400, it will effectively have an Attack stat of 200 until the effects of Slow Start wear off.",
		onStart: function(pokemon) {
			pokemon.addVolatile('SlowStart');
		},
		effect: {
			duration: 5,
			onStart: function(target) {
				this.add('message Slow Start!');
			},
			onModifyStats: function(stats) {
				stats.atk /= 2;
				stats.spe /= 2;
			},
			onEnd: function(target) {
				this.add('message Slow Start ended.');
			}
		},
		id: "SlowStart",
		name: "Slow Start",
		rating: -2,
		num: "112"
	},
	"Sniper": {
		desc: "When this Pokemon lands a Critical Hit, the base power of its attack tripled rather than doubled.",
		onModifyMove: function(move) {
			move.critModifier = 3;
		},
		id: "Sniper",
		name: "Sniper",
		rating: 1,
		num: "97"
	},
	"SnowCloak": {
		desc: "If active while Hail is in effect, this Pokemon's Evasion receives a 20% boost; if this Pokemon has a typing that would normally take damage from Hail, this Pokemon is also immune to Hail's damage.",
		onImmunity: function(type, pokemon) {
			if (type === 'Hail') return false;
		},
		onSourceModifyMove: function(move) {
			if (typeof move.accuracy !== 'number') return;
			if (this.weather === 'Hail')
			{	
				this.debug('snow cloak - decreasing accuracy');
				move.accuracy *= 0.8;
			}
		},
		id: "SnowCloak",
		name: "Snow Cloak",
		rating: 2,
		num: "81"
	},
	"SnowWarning": {
		desc: "When this Pokemon enters the battlefield, it causes a permanent Hail that can only be stopped by Air Lock, Cloud Nine or another weather condition.",
		onStart: function(source) {
			this.setWeather('Hail');
			this.weatherData.duration = 0;
		},
		id: "SnowWarning",
		name: "Snow Warning",
		rating: 4.5,
		num: "117"
	},
	"SolarPower": {
		desc: "If this Pokemon is active while Sunny Day is in effect, its Special Attack temporarily receives a 50% boost but this Pokemon also receives damage equal to one-eighth of its max HP after each turn.",
		onModifyStats: function(stats, pokemon) {
			if (this.weather === 'SunnyDay')
			{
				stats.spa *= 1.5;
			}
		},
		onWeather: function(target, source, effect) {
			if (effect.id === 'SunnyDay')
			{
				this.damage(target.hp/8);
			}
		},
		id: "SolarPower",
		name: "Solar Power",
		rating: 3,
		num: "94"
	},
	"SolidRock": {
		desc: "This Pokemon receives one-fourth reduced damage from Super Effective attacks.",
		onFoeBasePower: function(basePower, attacker, defender, move) {
			if (this.getEffectiveness(move.type, defender) > 0)
			{
				this.debug('Sold Rock neutralize');
				return basePower * 3/4;
			}
		},
		id: "SolidRock",
		name: "Solid Rock",
		rating: 3,
		num: "116"
	},
	"Soundproof": {
		desc: "This Pokemon is immune to the effects of the sound-related moves Bug Buzz, Chatter, Grasswhistle, Growl, Heal Bell, Hyper Voice, Metal Sound, Perish Song, Roar, Roar of Time, Sing, Sonicboom, Supersonic, Screech, Snore and Uproar.",
		id: "Soundproof",
		name: "Soundproof",
		rating: 2,
		num: "43"
	},
	"SpeedBoost": {
		desc: "While this Pokemon is active, its Speed increased by one stage at the end of every turn; the six stage maximum for stat boosts is still in effect.",
		onResidualPriority: -26.1,
		onResidual: function(pokemon) {
			if (pokemon.activeTurns)
			{
				this.boost({spe:1});
			}
		},
		id: "SpeedBoost",
		name: "Speed Boost",
		rating: 4.5,
		num: "3"
	},
	"Stall": {
		desc: "When all active Pokemon use moves that have the same priority value, this Pokemon always attacks last. See the\u00a0priority\u00a0page for more information.",
		onModifyMove: function(move) {
			move.priority -= 0.1;
		},
		id: "Stall",
		name: "Stall",
		rating: -1,
		num: "100"
	},
	"Static": {
		desc: "If an opponent\u00a0directly attacks\u00a0this Pokemon, there is a 30% chance that the opponent will become paralyzed. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of encountering an Electric-type Pokemon increases by 50%.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.isContact)
			{
				if (Math.random() * 10 < 3)
				{
					source.trySetStatus('par', target, effect);
				}
			}
		},
		id: "Static",
		name: "Static",
		rating: 2,
		num: "9"
	},
	"Steadfast": {
		desc: "If this Pokemon is made to flinch, its Speed receives a one-level boost.",
		onFlinch: function(pokemon) {
			this.boost({spe: 1});
		},
		id: "Steadfast",
		name: "Steadfast",
		rating: 1,
		num: "80"
	},
	"Stench": {
		desc: "When this Pokemon is in the first slot of the player's party, it halves the rate of wild encounters.",
		id: "Stench",
		name: "Stench",
		rating: 0,
		num: "1"
	},
	"StickyHold": {
		desc: "Opponents cannot remove items from this Pokemon. [Field Effect]\u00a0Pokemon hooked by a fishing rod are easier to catch.",
		id: "StickyHold",
		name: "Sticky Hold",
		rating: 1,
		num: "60"
	},
	"StormDrain": {
		desc: "During double battles, this Pokemon draws\u00a0any\u00a0single-target Water-type attack to itself. If an opponent uses an Water-type attack that affects multiple Pokemon, those targets will be hit. This ability does not affect Water Hidden Power, Judgment or Weather Ball. The user is immune to Water and its Special Attack is increased one stage when hit by one.",
		onImmunity: function(type, pokemon) {
			if (type === 'Water')
			{
				this.boost({spa:1});
				return null;
			}
		},
		id: "StormDrain",
		name: "Storm Drain",
		rating: 3,
		num: "114"
	},
	"Sturdy": {
		desc: "The one-hit KO moves Fissure, Guillotine, Horn Drill and Sheer Cold do not affect this Pokemon.",
		onDamagePriority: -100,
		onDamage: function(damage, target, source, effect) {
			if (effect && effect.ohko)
			{
				this.add('r-sturdy '+target.id);
				return 0;
			}
			if (target.hp == target.maxhp && damage >= target.hp)
			{
				this.add('r-sturdy '+target.id);
				return target.hp - 1;
			}
		},
		id: "Sturdy",
		name: "Sturdy",
		rating: 3,
		num: "5"
	},
	"SuctionCups": {
		desc: "Roar and Whirlwind do not affect this Pokemon. [Field Effect]\u00a0Pokemon hooked by a fishing rod are easier to catch.",
		onDragOut: false,
		id: "SuctionCups",
		name: "Suction Cups",
		rating: 3,
		num: "21"
	},
	"SuperLuck": {
		desc: "Raises the chance of this Pokemon scoring a Critical Hit.",
		onModifyMove: function(move) {
			move.critRatio++;
		},
		id: "SuperLuck",
		name: "Super Luck",
		rating: 1,
		num: "105"
	},
	"Swarm": {
		desc: "When its health reaches one-third or less of its max HP, this Pokemon's Bug-type attacks receive a 50% boost in power. [Field Effect]\u00a0Pokemon cries are heard more often.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp/3)
			{
				this.debug('Swarm boost');
				return basePower * 1.5;
			}
		},
		id: "Swarm",
		name: "Swarm",
		rating: 2,
		num: "68"
	},
	"SwiftSwim": {
		desc: "If this Pokemon is active while Rain Dance is in effect, its speed is temporarily doubled.",
		onModifyStats: function(stats, pokemon) {
			if (this.weather === 'RainDance')
			{
				stats.spe *= 2;
			}
		},
		id: "SwiftSwim",
		name: "Swift Swim",
		rating: 3.5,
		num: "33"
	},
	"Synchronize": {
		desc: "If an opponent burns, poisons or paralyzes this Pokemon, the same condition inflicts the opponent. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of encountering a Pokemon with the same nature increases by 50%",
		onAfterSetStatus: function(status, target, source) {
			if (!source || source === target) return;
			if (status.id === 'slp' || status.id === 'frz') return;
			source.trySetStatus(status);
		},
		id: "Synchronize",
		name: "Synchronize",
		rating: 3,
		num: "28"
	},
	"TangledFeet": {
		desc: "When this Pokemon is confused, its opponent's attacks have a 50% chance of missing.",
		onSourceModifyMove: function(move, source, target) {
			if (target && target.volatiles['confusion'] && move.accuracy !== true)
			{
				move.accuracy /= 2;
			}
		},
		id: "TangledFeet",
		name: "Tangled Feet",
		rating: 1,
		num: "77"
	},
	"Technician": {
		desc: "When this Pokemon uses an attack that has 60 Base Power or less, the move's Base Power receives a 50% boost. For example, a move with 60 Base Power effectively becomes a move with 90 Base Power.",
		onBasePowerPriority: 10,
		onBasePower: function(basePower, attacker, defender, move) {
			if (basePower <= 60)
			{
				this.debug('Technician boost');
				return basePower * 1.5;
			}
		},
		id: "Technician",
		name: "Technician",
		rating: 4,
		num: "101"
	},
	"Telepathy": {
		desc: "If a Pok\u00e9mon has Telepathy, it will not take damage from its teammates' moves in double and triple battles.",
		id: "Telepathy",
		name: "Telepathy",
		rating: 0,
		num: "140"
	},
	"Teravolt": {
		desc: "When this Pokemon becomes active, it nullifies the abilities of opposing active Pokemon that hinder this Pokemon's attacks. These abilities include Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightningrod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke and Wonder Guard.",
		onStart: function(pokemon) {
			this.add('message '+pokemon.name+' has Teravolt. (placeholder)');
		},
		onAllyModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target && pokemon !== this.activePokemon)
			{
				pokemon.ignore['Ability'] = 'A';
			}
		},
		onFoeModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target)
			{
				pokemon.ignore['Ability'] = 'A';
			}
		},
		id: "Teravolt",
		name: "Teravolt",
		rating: 3,
		num: "164"
	},
	"ThickFat": {
		desc: "This Pokemon receives halved damage from Ice-type and Fire-type attacks.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire')
			{
				this.debug('Thick Fat weaken');
				return basePower / 2;
			}
		},
		id: "ThickFat",
		name: "Thick Fat",
		rating: 3,
		num: "47"
	},
	"TintedLens": {
		desc: "Doubles the power of moves that are Not Very Effective against opponents.",
		onBasePowerPriority: -100,
		onBasePower: function(basePower, attacker, defender, move) {
			if (this.getEffectiveness(move.type, defender) < 0)
			{
				this.debug('Tinted Lens boost');
				return basePower * 2;
			}
		},
		id: "TintedLens",
		name: "Tinted Lens",
		rating: 4.5,
		num: "110"
	},
	"Torrent": {
		desc: "When its health reaches one-third or less of its max HP, this Pokemon's Water-type attacks receive a 50% boost in power.",
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp/3)
			{
				this.debug('Torrent boost');
				return basePower * 1.5;
			}
		},
		id: "Torrent",
		name: "Torrent",
		rating: 2,
		num: "67"
	},
	"ToxicBoost": {
		desc: "When the user is poisoned, its Attack stat is raised by 50%.",
		onModifyStats: function(stats, pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox')
			{
				stats.atk *= 1.5;
			}
		},
		id: "ToxicBoost",
		name: "Toxic Boost",
		rating: 3,
		num: "137"
	},
	"Trace": {
		desc: "When this Pokemon enters the field, it temporarily copies an opponent's ability (except Multitype). This ability remains with this Pokemon until it leaves the field.",
		onStart: function(pokemon) {
			var target = pokemon.side.foe.randomActive();
			var abilityid = target.ability;
			this.add('r-trace '+pokemon.id+' '+target.id+' '+abilityid);
			pokemon.setAbility(abilityid);
		},
		id: "Trace",
		name: "Trace",
		rating: 3.5,
		num: "36"
	},
	"Truant": {
		desc: "After this Pokemon is switched into battle, it skips every other turn.",
		onBeforeMove: function(pokemon) {
			if (pokemon.removeVolatile('Truant'))
			{
				this.add('cant-move '+pokemon.id+' truant');
				return false;
			}
			pokemon.addVolatile('Truant');
		},
		effect: {
			duration: 2
		},
		id: "Truant",
		name: "Truant",
		rating: -2,
		num: "54"
	},
	"Turboblaze": {
		desc: "When this Pokemon becomes active, it nullifies the abilities of opposing active Pokemon that hinder this Pokemon's attacks. These abilities include Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightningrod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke and Wonder Guard.",
		onStart: function(pokemon) {
			this.add('message '+pokemon.name+' has Turboblaze. (placeholder)');
		},
		onAllyModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target && pokemon !== this.activePokemon)
			{
				pokemon.ignore['Ability'] = 'A';
			}
		},
		onFoeModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target)
			{
				pokemon.ignore['Ability'] = 'A';
			}
		},
		id: "Turboblaze",
		name: "Turboblaze",
		rating: 3,
		num: "163"
	},
	"Unaware": {
		desc: "This Pokemon ignores an opponent's stat boosts for Attack, Defense, Special Attack and Special Defense. These boosts will still be calculated if this Pokemon uses Punishment.",
		id: "Unaware",
		name: "Unaware",
		rating: 2,
		num: "109"
	},
	"Unburden": {
		desc: "Increases Speed by one level if this Pokemon loses its held item through usage (i.e. Berries) or via Thief, Knock Off, etc.",
		onModifyStats: function(stats, pokemon) {
			if (pokemon.lastItem && !pokemon.item)
			{
				stats.spe *= 2;
			}
		},
		id: "Unburden",
		name: "Unburden",
		rating: 3.5,
		num: "84"
	},
	"Unnerve": {
		desc: "Opposing Pok\u00e9mon can't eat their Berries. ",
		onFoeEatItem: false,
		id: "Unnerve",
		name: "Unnerve",
		rating: 1,
		num: "127"
	},
	"VictoryStar": {
		desc: "Raises every friendly Pok\u00e9mon's Accuracy, including this Pok\u00e9mon's, by 10% (multiplied).",
		onAllyModifyMove: function(move) {
			if (typeof move.accuracy === 'number')
			{
				move.accuracy *= 1.1;
			}
		},
		id: "VictoryStar",
		name: "Victory Star",
		rating: 2,
		num: "162"
	},
	"VitalSpirit": {
		desc: "This Pokemon cannot be put to sleep; this includes both opponent-induced sleep as well as user-induced sleep via Rest. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of high-levelled wild Pokemon battles decreases by 50%.",
		onImmunity: function(type) {
			if (type === 'slp') return false;
		},
		id: "VitalSpirit",
		name: "Vital Spirit",
		rating: 1,
		num: "72"
	},
	"VoltAbsorb": {
		desc: "When an Electric-type attack hits this Pokemon, it recovers health equal to the damage that it would have taken; this Pokemon can recover up to 25% of its max HP in this way.",
		onImmunity: function(type, pokemon) {
			if (type === 'Electric')
			{
				var d = pokemon.heal(pokemon.maxhp/4);
				this.add('r-ability-heal '+pokemon.id+' VoltAbsorb '+d+pokemon.getHealth());
				return null;
			}
		},
		id: "VoltAbsorb",
		name: "Volt Absorb",
		rating: 3,
		num: "10"
	},
	"WaterAbsorb": {
		desc: "When a Water-type attack hits this Pokemon, it recovers health equal to the damage that it would have taken; this Pokemon can recover up to 25% of its max HP in this way.",
		onImmunity: function(type, pokemon) {
			if (type === 'Water')
			{
				var d = pokemon.heal(pokemon.maxhp/4);
				this.add('r-ability-heal '+pokemon.id+' WaterAbsorb '+d+pokemon.getHealth());
				return null;
			}
		},
		id: "WaterAbsorb",
		name: "Water Absorb",
		rating: 3,
		num: "11"
	},
	"WaterVeil": {
		desc: "This Pokemon cannot become burned.",
		onImmunity: function(type, pokemon) {
			if (type === 'brn') return false;
		},
		id: "WaterVeil",
		name: "Water Veil",
		rating: 1.5,
		num: "41"
	},
	"WeakArmor": {
		desc: "Causes physical moves to lower the Pok\u00e9mon's Defense and increase its Speed stat by one stage.",
		onAfterDamage: function(damage, target, source, move) {
			if (move.category === 'Physical')
			{
				this.boost({spe:1, def:-1});
			}
		},
		id: "WeakArmor",
		name: "Weak Armor",
		rating: 0,
		num: "133"
	},
	"WhiteSmoke": {
		desc: "Opponents cannot reduce this Pokemon's stats; they can, however, modify stat changes with Power Swap, Guard Swap and Heart Swap and inflict stat boosts with Swagger and Flatter. This ability does not prevent self-inflicted stat reductions. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of wild Pokemon battles decreases by 50%.",
		onBoost: function(boost, target, source) {
			if (!source || target === source) return;
			for (var i in boost)
			{
				if (boost[i] < 0)
				{
					delete boost[i];
				}
			}
		},
		id: "WhiteSmoke",
		name: "White Smoke",
		rating: 2,
		num: "73"
	},
	"WonderGuard": {
		desc: "This Pokemon only receives damage from attacks belonging to types that cause Super Effective to this Pokemon. Wonder Guard does not protect a Pokemon from status ailments (burn, freeze, paralysis, poison, sleep, Toxic or any of their side effects or damage), recoil damage nor the moves Beat Up, Bide, Doom Desire, Fire Fang, Future Sight, Hail, Leech Seed, Sandstorm, Spikes, Stealth Rock and Struggle. Wonder Guard cannot be Skill Swapped nor Role Played. Trace, however, does copy Wonder Guard.",
		onDamagePriority: 10,
		onDamage: function(damage, target, source, effect) {
			if (effect.effectType !== 'Move') return;
			if (effect.type === '???' || effect.id === 'Struggle') return;
			if (target.negateImmunity[effect.type]) return;
			this.debug('Wonder Guard immunity: '+effect.id);
			if (this.getEffectiveness(effect.type, target) <= 0)
			{
				this.add('r-immune '+target.id);
				return null;
			}
		},
		onSubDamage: function(damage, target, source, effect) {
			if (effect.effectType !== 'Move') return;
			if (target.negateImmunity[effect.type]) return;
			this.debug('Wonder Guard immunity: '+effect.id);
			if (this.getEffectiveness(effect.type, target) <= 0)
			{
				this.add('r-immune '+target.id);
				return null;
			}
		},
		id: "WonderGuard",
		name: "Wonder Guard",
		rating: 5,
		num: "25"
	},
	"WonderSkin": {
		desc: "Causes the chance of a status move working to be halved. It does not affect moves that inflict status as a secondary effect like Thunder's chance to paralyze.",
		onSourceModifyMove: function(move) {
			if (move.secondary)
			{
				this.debug('halving secondary chance');
				move.secondary.chance /= 2;
			}
		},
		id: "WonderSkin",
		name: "Wonder Skin",
		rating: 1,
		num: "147"
	},
	"ZenMode": {
		desc: "When Hihidaruma's HP drops to below half, it will change into its Daruma Mode at the end of the turn. If it loses its ability, or recovers HP to above half while in its Daruma mode, it will change back. This ability only works on Hihidaruma, even if it is copied by Role Play, Befriend, or swapped with Skill Swap.",
		onResidualPriority: -27,
		id: "ZenMode",
		name: "Zen Mode",
		rating: -1,
		num: "161"
	},
	
	
	// CAP
	"Mountaineer": {
		desc: "This Pokémon avoids all Rock-type attacks and hazards when switching in.",
		onDamage: function(damage, target, source, effect) {
			if (effect && effect.id === 'StealthRock')
			{
				return false;
			}
		},
		onImmunity: function(type, target) {
			if (type === 'Rock' && !target.activeTurns)
			{
				return false;
			}
		},
		id: "Mountaineer",
		name: "Mountaineer",
		rating: 3.5,
		num: "-2"
	},
	"Rebound": {
		desc: "It can reflect the effect of status moves when switching in.",
		id: "Rebound",
		name: "Rebound",
		onAllyFieldHit: function(target, source, move) {
			if (target === source) return;
			if (this.effectData.target.activeTurns) return;
			if (typeof move.isBounceable === 'undefined')
			{
				move.isBounceable = !!(move.status || move.forceSwitch);
			}
			if (move.target !== 'foeSide' && target !== this.effectData.target)
			{
				return;
			}
			if (this.pseudoWeather['MagicBounce'])
			{
				return;
			}
			if (move.isBounceable)
			{
				this.addPseudoWeather('MagicBounce');
				this.add('r-bounce-back '+source.id+' Rebound '+move.id+' '+target.id);
				this.moveHit(source, source, move);
				return null;
			}
		},
		effect: {
			duration: 1
		},
		rating: 4.5,
		num: "-3"
	},
	"Persistent": {
		desc: "Increases the duration of many field effects by two turns when used by this Pokémon.",
		id: "Persistent",
		name: "Persistent",
		// implemented in the corresponding move
		rating: 4,
		num: "-4"
	}
};
