<template>
	<div class="club-tree-select" :class="{'opened': isOpened}">
		<div class="club-tree-select__search">
			<input
				:ref="REF_INPUT"
				type="text"
				v-model="search"
				autocomplete="off"
				tabindex="0"
				:placeholder="inputPlaceholder"
				@blur="onBlur"
				@focus="onFocus"
			/>
			<div v-if="needShowClear" class="club-tree-select__clear-container" @mousedown="clearInput">
				<icon size="24">$close</icon>
			</div>

			<div class="club-tree-select__arrow-container" @mousedown="toggleFocus">
				<icon size="24">$arrow-down</icon>
			</div>
		</div>
		<div v-if="isOpened" class="club-tree-select__options-container" :style="optionsContainerCssStyle">
			<club-tree-select-option
				v-for="root in options"
				:key="'opt_' + root.id"
				:option="root"
				:selected-id="selectedId"
				:search-text="search"
				@select="onSelect"
			/>
		</div>
	</div>
</template>

<script lang="ts" src="./club-tree-select.ts"></script>

<style lang="scss">
	.club-tree-select {
		$input-height: 42px;
		$container:    &;
		position:      relative;
		font-size:     14px;

		&.opened {
			#{$container}__arrow-container {
				.icon {
					transform: rotate(180deg);
				}
			}

			#{$container}__search {
				z-index: 1000;
			}

			#{$container}__options-container {
				z-index: 999;
			}
		}

		&__search {
			position: relative;
			z-index:  1;

			input {
				width:         100%;
				min-height:    $input-height;
				border-radius: 8px;
				padding:       5px 70px 5px 10px;
				border:        1px solid #ddd;
				outline:       none;

				&::placeholder {
					color: #bbb;
				}
			}
		}

		&__arrow-container {
			right: 15px;
			width: 20px;
		}

		&__clear-container {
			right: 40px;
			width: 20px;
		}

		&__arrow-container, &__clear-container {
			position:        absolute;
			display:         flex;
			align-items:     center;
			justify-content: center;
			top:             0;
			height:          100%;
			cursor:          pointer;
		}

		&__options-container {
			position:         absolute;
			top:              $input-height - 4px;
			border:           1px solid #ddd;
			border-top:       none;
			padding:          15px 15px 10px;
			width:            100%;
			background-color: #fff;
			overflow-y:       auto;

			&:empty {
				display:     flex;
				align-items: center;

				&:before {
					content:       "!";
					border-radius: 50%;
					position:      relative;
					width:         15px;
					height:        15px;
					background:    #fb8c00;
					color:         #eee;
					padding:       0 6px;
					font-size:     10px;
					font-weight:   bold;
					margin-right:  5px;
				}

				&:after {
					content: "Ничего не найдено";
				}
			}
		}
	}

</style>
