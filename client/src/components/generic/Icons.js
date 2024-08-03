const CoinIcon = () => {
    return (
        <svg class="flex relative top-1 left-1" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 10 12.5" enableBackground="new 0 0 10 10">
            <path d="M7.209,2.27V1.821c0-0.375-0.303-0.679-0.674-0.679H0.902c-0.371,0-0.674,0.304-0.674,0.679v0.692  c0,0.344,0.256,0.629,0.586,0.673C0.771,3.332,0.781,3.391,0.781,3.904c0,0.19,0.067,0.365,0.18,0.5  c-0.112,0.135-0.18,0.31-0.18,0.499c0,0.507-0.013,0.579,0.038,0.734C0.48,5.72,0.229,6.027,0.229,6.395v0.492  c0,0.43,0.347,0.777,0.773,0.777h2.943c0.605,0.73,1.514,1.193,2.526,1.193c1.819,0,3.3-1.496,3.3-3.335  C9.771,3.939,8.675,2.61,7.209,2.27z M0.902,2.633c-0.063,0-0.115-0.054-0.115-0.12V1.821c0-0.066,0.053-0.12,0.115-0.12h5.633  c0.063,0,0.115,0.054,0.115,0.12v0.37C5.986,2.154,5.357,2.319,4.823,2.633C4.676,2.633,1.264,2.633,0.902,2.633z M3.174,5.615  h-1.62c-0.118,0-0.214-0.098-0.214-0.22V4.903c0-0.121,0.096-0.219,0.214-0.219h1.724C3.201,4.981,3.165,5.294,3.174,5.615z   M1.554,4.124c-0.118,0-0.214-0.099-0.214-0.22V3.412c0-0.122,0.096-0.22,0.214-0.22h2.56C3.852,3.462,3.635,3.777,3.477,4.124  H1.554z M1.002,7.107c-0.119,0-0.215-0.1-0.215-0.221V6.395c0-0.121,0.096-0.221,0.215-0.221h2.234  c0.064,0.332,0.178,0.645,0.332,0.934H1.002L1.002,7.107z M6.472,8.299c-1.511,0-2.74-1.246-2.74-2.777  c0-1.531,1.229-2.777,2.74-2.777s2.741,1.246,2.741,2.777C9.213,7.053,7.982,8.299,6.472,8.299z" />
            <text x="0" y="25" fill="#000000" fontSize="5px" fontWeight="bold" fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by verry poernomo</text>
            <text x="0" y="30" fill="#000000" fontSize="5px" fontWeight="bold" fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun Project</text>
        </svg>
    );
}

const DeadIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    );
}

export { CoinIcon, DeadIcon };