import {Vue, Prop, Component, Watch} from '~/node_modules/vue-property-decorator';
import {VueTreeSelectItem} from '~/models/common/VueTreeSelectItem';
import {Model} from 'vue-property-decorator';
import ClubTreeSelectOption from '~/components/common/select/club-tree-select/club-tree-select-option/club-tree-select-option';
import TreeSelectHelper from '~/helpers/TreeSelectHelper';

/**
 * Клубная реализация компонента vue-treeselect с возможностью единичного выбора.
 *
 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
 */
@Component({
	components: {
		ClubTreeSelectOption,
	},
})
export default class ClubTreeSelect extends Vue {
	/** Выбранные значения. */
	@Model('model-change')
	public selectedId!: number|null;
	protected readonly EVENT_MODEL_CHANGE = 'model-change';

	/** Список элементов доступных для выбора. */
	@Prop({default: () => []})
	public options!: VueTreeSelectItem[];

	/** Приглашение для выбора */
	@Prop({default: 'Выберите значение'})
	public placeholder!: string;

	/** Максимальная высота блока с вариантами для выбора */
	@Prop({default: 400})
	public maxHeight!: number;

	/** Возможность удалить выбранное значение. */
	@Prop({default: false})
	public clearable!: boolean;

	protected readonly REF_INPUT: string = 'search-input';

	/** Ручной поиск */
	protected search: string = '';

	/** Раскрыт ли блок с элементами для выбора. */
	protected isOpened: boolean = false;

	/** Выбранный элемент. */
	protected selectedItem: VueTreeSelectItem|null = null;

	/**
	 * Обработчик изменений списка доступных вариантов для выбора.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	@Watch('options', {immediate: true})
	protected onOptionsChange(): void {
		this.setSelectedItem();
	}

	/**
	 * Обработчик изменений списка доступных вариантов для выбора.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	@Watch('selectedId', {immediate: true})
	protected onSelectedIdChange(): void {
		this.setSelectedItem();
	}

	/**
	 * Получение html-элемента ввода поисковой строки.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected get searchInput(): HTMLInputElement {
		return this.$refs[this.REF_INPUT] as HTMLInputElement;
	}

	/**
	 * Поиск выбранного элемента из списка опций.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected setSelectedItem(): void {
		if (null !== this.selectedId) {
			const treeHelper = new TreeSelectHelper(this.options);

			this.selectedItem = treeHelper.findById(this.selectedId);
			this.search       = (this.selectedItem?.label || '');
		}
		else {
			this.selectedItem = null;
			this.search       = '';
		}
	}

	/**
	 * Приглашение для поля поиска.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected get inputPlaceholder(): string {
		return (this.selectedItem?.label || this.placeholder);
	}

	/**
	 * Установка состояния раскрытости блока с элементами для выбора.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected setIsOpened(isOpened: boolean): void {
		this.isOpened = isOpened;
	}

	/**
	 * Обработчик получения фокуса поисковой строкой.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected onFocus(): void {
		this.setIsOpened(true);

		this.search = '';
	}

	/**
	 * Обработчик потери фокуса поисковой строкой.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected onBlur(): void {
		this.setIsOpened(false);

		if (null !== this.selectedItem) {
			this.search = this.selectedItem.label;
		}
		else {
			this.search = '';
		}
	}

	/**
	 * Переключение фокуса поисковой строки на противоположное.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected toggleFocus(e: MouseEvent): void {
		e.preventDefault();

		if (this.isOpened) {
			this.searchInput.blur();
		}
		else {
			this.searchInput.focus();
		}
	}

	/**
	 * Нужно ли отображать кнопку очистки поля ввода.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected get needShowClear(): boolean {
		if (false === this.clearable) {
			return false;
		}

		return (null !== this.selectedItem || '' !== this.search);
	}

	/**
	 * Очистка поля ввода.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected clearInput(e: MouseEvent): void {
		e.preventDefault();

		this.search       = '';
		this.selectedItem = null;

		this.searchInput.blur();

		this.$emit(this.EVENT_MODEL_CHANGE, null);
	}

	/**
	 * Калькулируемые стили блока с вариантами для выбора.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected get optionsContainerCssStyle(): object {
		return {'max-height': this.maxHeight + 'px'};
	}

	/**
	 * Обработчик события выбора элемента.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected onSelect(item: VueTreeSelectItem): void {
		this.searchInput.blur();

		this.$emit(this.EVENT_MODEL_CHANGE, item.id);
	}
}
