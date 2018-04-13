export class CardModel {
    private question: string;
    private answer: string;
    private source: string;
    private failCount: number;
    private stage: number;
    
    /**
     * Getter $question
     * @return {string}
     */
	public get $question(): string {
		return this.question;
	}

    /**
     * Getter $answer
     * @return {string}
     */
	public get $answer(): string {
		return this.answer;
	}

    /**
     * Getter $source
     * @return {string}
     */
	public get $source(): string {
		return this.source;
	}

    /**
     * Getter $failCount
     * @return {number}
     */
	public get $failCount(): number {
		return this.failCount;
	}

    /**
     * Getter $stage
     * @return {number}
     */
	public get $stage(): number {
		return this.stage;
	}

    /**
     * Setter $question
     * @param {string} value
     */
	public set $question(value: string) {
		this.question = value;
	}

    /**
     * Setter $answer
     * @param {string} value
     */
	public set $answer(value: string) {
		this.answer = value;
	}

    /**
     * Setter $source
     * @param {string} value
     */
	public set $source(value: string) {
		this.source = value;
	}

    /**
     * Setter $failCount
     * @param {number} value
     */
	public set $failCount(value: number) {
		this.failCount = value;
	}

    /**
     * Setter $stage
     * @param {number} value
     */
	public set $stage(value: number) {
		this.stage = value;
	}
    
    
}