interface IconProps {
  size: number
  className?: string
  color?: string
}

export function AnqaIcon({ size, className }: IconProps) {
  return (
    <svg height={size} viewBox="0 0 29 45" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M21.5015 29.4022C22.5943 29.4022 23.661 29.5262 24.6758 29.7743C24.7746 29.8002 24.8839 29.8208 24.9828 29.8518C26.3045 30.1826 27.85 30.7149 28.9844 31.4075V23.2417H28.9896V19.0605H28.9844V14.3936C28.9844 6.46032 22.4798 0 14.4922 0C6.50458 0 0.00520366 6.47065 0.00520366 14.4039V24.0272C0.541181 23.3864 1.09797 22.7662 1.69119 22.177C2.4197 21.4534 3.18984 20.7764 4.00682 20.1562V14.4039C4.00682 8.65683 8.71093 3.98989 14.4922 3.98989C20.2735 3.98989 24.9776 8.662 24.9776 14.4039V25.7689C24.8787 25.7482 24.7694 25.7276 24.6706 25.7069C23.6454 25.5208 22.5735 25.4227 21.4963 25.4227C12.7854 25.4227 5.51068 31.6711 4.00161 39.9093V31.6401C4.00161 31.6401 4.00682 31.6349 4.00682 31.6246C6.94168 27.1437 11.5469 23.8412 16.9275 22.5749C18.2232 22.27 19.5554 22.084 20.9291 22.0323V18.0475V14.5538C20.9291 11.0291 18.0411 8.16067 14.4922 8.16067C10.9433 8.16067 8.05527 11.0291 8.05527 14.5538V17.6909C8.6693 17.3292 9.40301 16.9467 10.2512 16.6056C10.8965 16.3472 11.5053 16.1508 12.0569 16.0061V14.5538C12.0569 13.2204 13.1496 12.1351 14.4922 12.1351C15.8347 12.1351 16.9275 13.2204 16.9275 14.5538V18.5024C11.9372 19.4792 7.47766 21.9134 4.00682 25.3451C2.46133 26.8801 1.11358 28.6115 0.00520366 30.4927V31.5522C0.00520366 31.5522 0 31.5574 0 31.5677V44.8656H7.83151C7.75345 44.2868 7.71182 43.6924 7.71182 43.0981C7.71182 42.3435 7.77427 41.6096 7.89395 40.8912C8.9555 34.3792 14.6535 29.4022 21.4963 29.4022H21.5015Z" fill="url(#paint0_linear_8575_264)" />
      <path d="M28.9844 35.6094C27.8656 34.5499 26.5022 33.7385 24.988 33.2527H24.9828C23.9837 32.9323 22.9273 32.7617 21.8189 32.7617C21.1685 32.7617 20.5336 32.8238 19.9144 32.9426C18.8372 33.1339 17.8225 33.4956 16.8963 33.9866C14.2632 35.4079 12.3067 37.9093 11.6562 40.8914C11.4949 41.5994 11.4116 42.3437 11.4116 43.0982C11.4116 43.7029 11.4689 44.2921 11.5729 44.8709H15.5798C15.4288 44.3283 15.3508 43.7598 15.3508 43.1706C15.3508 39.7957 17.963 37.0307 21.2882 36.7568C21.3454 36.7516 21.4079 36.7465 21.4703 36.7465C21.5848 36.7413 21.7045 36.7361 21.8241 36.7361C21.9751 36.7361 22.126 36.7361 22.2717 36.7516C22.4018 36.762 22.537 36.7723 22.6671 36.793C22.8753 36.8188 23.073 36.855 23.276 36.9015C23.2916 36.9015 23.302 36.9067 23.3176 36.9118C23.9108 37.0514 24.4728 37.2788 24.988 37.5682V40.726C25.4927 40.9483 25.9038 41.155 26.2004 41.31C26.7832 41.6149 27.4181 41.9509 28.1622 42.4987C28.5317 42.7675 28.8127 43.0156 29 43.1809C29 40.6588 28.9948 38.1315 28.9896 35.6094H28.9844Z" fill="url(#paint1_linear_8575_264)" />
      <path d="M21.3143 40.7622C20.1383 40.7622 19.1808 41.7132 19.1808 42.8812C19.1808 44.0492 20.1383 45.0002 21.3143 45.0002C22.4903 45.0002 23.4478 44.0492 23.4478 42.8812C23.4478 41.7132 22.4903 40.7622 21.3143 40.7622Z" fill="white" />
      <defs>
        <linearGradient id="paint0_linear_8575_264" x1="0" y1="0" x2="40.9024" y2="26.4288" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0CA0EB" />
          <stop offset="1" stopColor="#0165A3" />
        </linearGradient>
        <linearGradient id="paint1_linear_8575_264" x1="11.4116" y1="32.7617" x2="22.7236" y2="49.1921" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0CA0EB" />
          <stop offset="1" stopColor="#0165A3" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function ArrowFilledDownIcon({ color, size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9.62372 12.144L5.99415 7.99591C5.71127 7.67262 5.94086 7.16666 6.37044 7.16666H13.6296C14.0592 7.16666 14.2887 7.67262 14.0059 7.99591L10.3763 12.144C10.1771 12.3716 9.82292 12.3716 9.62372 12.144Z" fill={color ?? "#F8F9FA"} stroke={color ?? "#F8F9FA"} />
    </svg>
  )
}

export function SettingIcon({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M17.9958 21.5104C18.064 21.3401 18.1776 21.1918 18.3243 21.0817L19.0808 20.5144C19.3433 20.3175 19.6858 20.2619 19.9971 20.3657L20.7772 20.6257C21.2493 20.7831 21.7653 20.5694 21.9879 20.1243L22.6385 18.8231C22.8493 18.4013 22.7369 17.8896 22.3687 17.595L21.6253 17.0002C21.3881 16.8105 21.25 16.5232 21.25 16.2194V15.7806C21.25 15.4768 21.3881 15.1895 21.6253 14.9998L22.3687 14.405C22.7369 14.1104 22.8493 13.5987 22.6385 13.1769L21.9879 11.8757C21.7653 11.4306 21.2493 11.2169 20.7772 11.3743L19.893 11.669C19.6413 11.7529 19.3667 11.7334 19.1295 11.6148L18.4705 11.2852C18.2333 11.1666 18.0529 10.9586 17.969 10.707L17.6279 9.68377C17.4918 9.27543 17.1097 9 16.6792 9H15.3208C14.8903 9 14.5082 9.27543 14.3721 9.68377L14.031 10.707C13.9471 10.9586 13.7667 11.1666 13.5295 11.2852L12.8705 11.6148C12.6333 11.7334 12.3586 11.7529 12.107 11.669L11.2228 11.3743C10.7507 11.2169 10.2347 11.4306 10.0121 11.8757L9.36153 13.1769C9.15065 13.5987 9.26305 14.1104 9.63126 14.405L10.3747 14.9998C10.6119 15.1895 10.75 15.4768 10.75 15.7806V16.4838C10.75 16.8351 10.5657 17.1606 10.2645 17.3413L9.79406 17.6236C9.34599 17.8924 9.18044 18.4609 9.41413 18.9283L10.0121 20.1243C10.2347 20.5694 10.7507 20.7831 11.2228 20.6257L12.0029 20.3657C12.3142 20.2619 12.6566 20.3175 12.9192 20.5144L13.6757 21.0817C13.8224 21.1918 13.936 21.3401 14.0041 21.5104L14.3485 22.3714C14.5004 22.751 14.8681 23 15.277 23H16.723C17.1319 23 17.4996 22.751 17.6514 22.3714L17.9958 21.5104ZM18.1 16C18.1 17.1598 17.1598 18.1 16 18.1C14.8402 18.1 13.9 17.1598 13.9 16C13.9 14.8402 14.8402 13.9 16 13.9C17.1598 13.9 18.1 14.8402 18.1 16Z" fill="#9AA0A6" />
      <path d="M18.3243 21.0817L18.0243 20.6817V20.6818L18.3243 21.0817ZM17.9958 21.5104L17.5316 21.3247V21.3247L17.9958 21.5104ZM19.0808 20.5144L19.3808 20.9144V20.9144L19.0808 20.5144ZM19.9971 20.3657L20.1552 19.8913H20.1552L19.9971 20.3657ZM20.7772 20.6257L20.6191 21.1001H20.6191L20.7772 20.6257ZM21.9879 20.1243L22.4351 20.3479H22.4351L21.9879 20.1243ZM22.6385 18.8231L22.1912 18.5995H22.1912L22.6385 18.8231ZM22.3687 17.595L22.6811 17.2046L22.3687 17.595ZM21.6253 17.0002L21.3129 17.3907H21.313L21.6253 17.0002ZM21.6253 14.9998L21.313 14.6093L21.3129 14.6093L21.6253 14.9998ZM22.3687 14.405L22.0564 14.0146V14.0146L22.3687 14.405ZM22.6385 13.1769L23.0857 12.9533L23.0857 12.9533L22.6385 13.1769ZM21.9879 11.8757L21.5406 12.0993V12.0993L21.9879 11.8757ZM20.7772 11.3743L20.6191 10.8999L20.7772 11.3743ZM19.893 11.669L19.7348 11.1947H19.7348L19.893 11.669ZM19.1295 11.6148L18.9059 12.062L18.9059 12.062L19.1295 11.6148ZM18.4705 11.2852L18.6941 10.838L18.6941 10.838L18.4705 11.2852ZM17.969 10.707L17.4947 10.8652V10.8652L17.969 10.707ZM17.6279 9.68377L18.1023 9.52566V9.52566L17.6279 9.68377ZM14.3721 9.68377L14.8464 9.84189L14.3721 9.68377ZM14.031 10.707L13.5566 10.5489L13.5566 10.5489L14.031 10.707ZM13.5295 11.2852L13.7531 11.7325L13.7531 11.7325L13.5295 11.2852ZM12.8705 11.6148L12.6469 11.1675L12.8705 11.6148ZM12.107 11.669L12.2651 11.1947H12.2651L12.107 11.669ZM11.2228 11.3743L11.3809 10.8999H11.3809L11.2228 11.3743ZM10.0121 11.8757L9.56491 11.6521H9.56491L10.0121 11.8757ZM9.36153 13.1769L8.91431 12.9533L9.36153 13.1769ZM9.63126 14.405L9.94361 14.0146L9.94361 14.0146L9.63126 14.405ZM10.3747 14.9998L10.0623 15.3902H10.0623L10.3747 14.9998ZM10.2645 17.3413L10.5217 17.77H10.5217L10.2645 17.3413ZM9.79406 17.6236L9.53681 17.1948H9.53681L9.79406 17.6236ZM9.41413 18.9283L9.86134 18.7047H9.86134L9.41413 18.9283ZM10.0121 20.1243L9.56491 20.3479H9.56491L10.0121 20.1243ZM11.2228 20.6257L11.3809 21.1001H11.3809L11.2228 20.6257ZM12.0029 20.3657L11.8448 19.8913H11.8448L12.0029 20.3657ZM12.9192 20.5144L12.6192 20.9144L12.6192 20.9144L12.9192 20.5144ZM13.6757 21.0817L13.9757 20.6818L13.9757 20.6817L13.6757 21.0817ZM14.0041 21.5104L14.4684 21.3247L14.0041 21.5104ZM14.3485 22.3714L14.8128 22.1857L14.8128 22.1857L14.3485 22.3714ZM17.6514 22.3714L17.1872 22.1857L17.6514 22.3714ZM18.0243 20.6818C17.8042 20.8468 17.6338 21.0692 17.5316 21.3247L18.4601 21.6961C18.4941 21.6109 18.551 21.5368 18.6243 21.4817L18.0243 20.6818ZM18.7808 20.1144L18.0243 20.6817L18.6243 21.4818L19.3808 20.9144L18.7808 20.1144ZM20.1552 19.8913C19.6882 19.7357 19.1746 19.819 18.7808 20.1144L19.3808 20.9144C19.5121 20.8159 19.6833 20.7881 19.8389 20.84L20.1552 19.8913ZM20.9353 20.1514L20.1552 19.8913L19.8389 20.84L20.6191 21.1001L20.9353 20.1514ZM21.5406 19.9007C21.4294 20.1232 21.1714 20.2301 20.9353 20.1514L20.6191 21.1001C21.3273 21.3361 22.1012 21.0155 22.4351 20.3479L21.5406 19.9007ZM22.1912 18.5995L21.5406 19.9007L22.4351 20.3479L23.0857 19.0467L22.1912 18.5995ZM22.0564 17.9854C22.2405 18.1327 22.2967 18.3886 22.1912 18.5995L23.0857 19.0467C23.402 18.414 23.2334 17.6464 22.6811 17.2046L22.0564 17.9854ZM21.313 17.3907L22.0564 17.9854L22.6811 17.2046L21.9376 16.6098L21.313 17.3907ZM20.75 16.2194C20.75 16.6751 20.9571 17.106 21.3129 17.3907L21.9376 16.6098C21.819 16.5149 21.75 16.3713 21.75 16.2194H20.75ZM20.75 15.7806V16.2194H21.75V15.7806H20.75ZM21.3129 14.6093C20.9571 14.894 20.75 15.3249 20.75 15.7806H21.75C21.75 15.6287 21.819 15.4851 21.9376 15.3902L21.3129 14.6093ZM22.0564 14.0146L21.313 14.6093L21.9376 15.3902L22.6811 14.7954L22.0564 14.0146ZM22.1912 13.4005C22.2967 13.6114 22.2405 13.8673 22.0564 14.0146L22.6811 14.7954C23.2334 14.3536 23.402 13.586 23.0857 12.9533L22.1912 13.4005ZM21.5406 12.0993L22.1912 13.4005L23.0857 12.9533L22.4351 11.6521L21.5406 12.0993ZM20.9353 11.8486C21.1714 11.7699 21.4294 11.8768 21.5406 12.0993L22.4351 11.6521C22.1012 10.9845 21.3273 10.6639 20.6191 10.8999L20.9353 11.8486ZM20.0511 12.1434L20.9353 11.8486L20.6191 10.8999L19.7348 11.1947L20.0511 12.1434ZM18.9059 12.062C19.2617 12.2399 19.6737 12.2692 20.0511 12.1434L19.7348 11.1947C19.609 11.2366 19.4717 11.2268 19.3531 11.1675L18.9059 12.062ZM18.2469 11.7325L18.9059 12.062L19.3531 11.1675L18.6941 10.838L18.2469 11.7325ZM17.4947 10.8652C17.6205 11.2426 17.891 11.5545 18.2469 11.7325L18.6941 10.838C18.5755 10.7787 18.4853 10.6747 18.4433 10.5489L17.4947 10.8652ZM17.1536 9.84189L17.4947 10.8652L18.4433 10.5489L18.1023 9.52566L17.1536 9.84189ZM16.6792 9.5C16.8944 9.5 17.0855 9.63771 17.1536 9.84189L18.1023 9.52566C17.8981 8.91315 17.3249 8.5 16.6792 8.5V9.5ZM15.3208 9.5H16.6792V8.5H15.3208V9.5ZM14.8464 9.84189C14.9145 9.63772 15.1055 9.5 15.3208 9.5V8.5C14.6751 8.5 14.1019 8.91315 13.8977 9.52566L14.8464 9.84189ZM14.5053 10.8652L14.8464 9.84189L13.8977 9.52566L13.5566 10.5489L14.5053 10.8652ZM13.7531 11.7325C14.1089 11.5545 14.3795 11.2426 14.5053 10.8652L13.5566 10.5489C13.5147 10.6747 13.4245 10.7787 13.3059 10.838L13.7531 11.7325ZM13.0941 12.062L13.7531 11.7325L13.3059 10.838L12.6469 11.1675L13.0941 12.062ZM11.9489 12.1434C12.3263 12.2692 12.7383 12.2399 13.0941 12.062L12.6469 11.1675C12.5283 11.2268 12.391 11.2366 12.2651 11.1947L11.9489 12.1434ZM11.0647 11.8486L11.9489 12.1434L12.2651 11.1947L11.3809 10.8999L11.0647 11.8486ZM10.4593 12.0993C10.5706 11.8768 10.8286 11.7699 11.0647 11.8486L11.3809 10.8999C10.6727 10.6639 9.89875 10.9845 9.56491 11.6521L10.4593 12.0993ZM9.80874 13.4005L10.4593 12.0993L9.56491 11.6521L8.91431 12.9533L9.80874 13.4005ZM9.94361 14.0146C9.7595 13.8673 9.7033 13.6114 9.80874 13.4005L8.91431 12.9533C8.598 13.586 8.7666 14.3536 9.31891 14.7954L9.94361 14.0146ZM10.687 14.6093L9.94361 14.0146L9.31891 14.7954L10.0623 15.3902L10.687 14.6093ZM11.25 15.7806C11.25 15.3249 11.0429 14.894 10.687 14.6093L10.0623 15.3902C10.1809 15.4851 10.25 15.6287 10.25 15.7806H11.25ZM11.25 16.4838V15.7806H10.25V16.4838H11.25ZM10.5217 17.77C10.9735 17.499 11.25 17.0107 11.25 16.4838H10.25C10.25 16.6594 10.1578 16.8222 10.0072 16.9126L10.5217 17.77ZM10.0513 18.0523L10.5217 17.77L10.0072 16.9126L9.53681 17.1948L10.0513 18.0523ZM9.86134 18.7047C9.7445 18.471 9.82727 18.1867 10.0513 18.0523L9.53681 17.1948C8.8647 17.5981 8.61639 18.4508 8.96691 19.1519L9.86134 18.7047ZM10.4593 19.9007L9.86134 18.7047L8.96691 19.1519L9.56491 20.3479L10.4593 19.9007ZM11.0647 20.1514C10.8286 20.2301 10.5706 20.1232 10.4593 19.9007L9.56491 20.3479C9.89875 21.0155 10.6727 21.3361 11.3809 21.1001L11.0647 20.1514ZM11.8448 19.8913L11.0647 20.1514L11.3809 21.1001L12.161 20.84L11.8448 19.8913ZM13.2192 20.1144C12.8254 19.819 12.3118 19.7357 11.8448 19.8913L12.161 20.84C12.3167 20.7881 12.4879 20.8159 12.6192 20.9144L13.2192 20.1144ZM13.9757 20.6817L13.2192 20.1144L12.6192 20.9144L13.3757 21.4818L13.9757 20.6817ZM14.4684 21.3247C14.3662 21.0692 14.1957 20.8468 13.9757 20.6818L13.3757 21.4817C13.449 21.5368 13.5058 21.6109 13.5399 21.6961L14.4684 21.3247ZM14.8128 22.1857L14.4684 21.3247L13.5399 21.6961L13.8843 22.5571L14.8128 22.1857ZM15.277 22.5C15.0726 22.5 14.8887 22.3755 14.8128 22.1857L13.8843 22.5571C14.1121 23.1266 14.6637 23.5 15.277 23.5V22.5ZM16.723 22.5H15.277V23.5H16.723V22.5ZM17.1872 22.1857C17.1113 22.3755 16.9274 22.5 16.723 22.5V23.5C17.3363 23.5 17.8879 23.1266 18.1157 22.5571L17.1872 22.1857ZM17.5316 21.3247L17.1872 22.1857L18.1157 22.5571L18.4601 21.6961L17.5316 21.3247ZM16 18.6C17.4359 18.6 18.6 17.4359 18.6 16H17.6C17.6 16.8837 16.8836 17.6 16 17.6V18.6ZM13.4 16C13.4 17.4359 14.5641 18.6 16 18.6V17.6C15.1163 17.6 14.4 16.8837 14.4 16H13.4ZM16 13.4C14.5641 13.4 13.4 14.5641 13.4 16H14.4C14.4 15.1163 15.1163 14.4 16 14.4V13.4ZM18.6 16C18.6 14.5641 17.4359 13.4 16 13.4V14.4C16.8836 14.4 17.6 15.1163 17.6 16H18.6Z" fill="#9AA0A6" />
    </svg>
  )
}

export function SwapIcon({ size, className, color }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.46116 3.83503L5.82477 3.19864L5.19657 3.82684C5.191 3.83227 5.1855 3.83776 5.18008 3.84333L3.03039 5.99302C2.67892 6.34449 2.67892 6.91434 3.03039 7.26581C3.38186 7.61728 3.95171 7.61728 4.30318 7.26581L4.92466 6.64433V10.9454C4.92466 11.4424 5.32761 11.8454 5.82466 11.8454C6.32172 11.8454 6.72466 11.4424 6.72466 10.9454V6.64412L7.34636 7.26581C7.69783 7.61728 8.26768 7.61728 8.61915 7.26581C8.97062 6.91434 8.97062 6.34449 8.61915 5.99302L6.46116 3.83503ZM10.4914 13.3563L9.85504 12.7199L7.69706 10.562C7.34558 10.2105 7.34558 9.64064 7.69706 9.28917C8.04853 8.9377 8.61838 8.9377 8.96985 9.28917L9.59154 9.91087L9.59154 5.6096C9.59154 5.11255 9.99449 4.7096 10.4915 4.7096C10.9886 4.7096 11.3915 5.11255 11.3915 5.6096L11.3915 9.91066L12.013 9.28917C12.3645 8.9377 12.9343 8.9377 13.2858 9.28917C13.6373 9.64065 13.6373 10.2105 13.2858 10.562L11.1361 12.7117C11.1307 12.7172 11.1252 12.7227 11.1197 12.7281L10.4914 13.3563Z" fill={color ?? "#101010"} />
    </svg>
  )
}

export function WalletIcon({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.64958 5.55487C4.30049 5.55487 3.9657 5.69355 3.71886 5.94039C3.47202 6.18723 3.33334 6.52202 3.33334 6.87111V11.1788C3.33334 11.5279 3.47202 11.8627 3.71886 12.1095C3.9657 12.3564 4.30049 12.495 4.64958 12.495H11.3504C11.6995 12.495 12.0343 12.3564 12.2812 12.1095C12.528 11.8627 12.6667 11.5279 12.6667 11.1788V6.87111C12.6667 6.52202 12.528 6.18723 12.2812 5.94039C12.0343 5.69355 11.6995 5.55487 11.3504 5.55487H4.64958ZM10.1539 8.42667C9.99518 8.42667 9.843 8.4897 9.7308 8.6019C9.6186 8.7141 9.55557 8.86628 9.55557 9.02496C9.55557 9.18363 9.6186 9.33581 9.7308 9.44801C9.843 9.56021 9.99518 9.62325 10.1539 9.62325C10.3125 9.62325 10.4647 9.56021 10.5769 9.44801C10.6891 9.33581 10.7521 9.18363 10.7521 9.02496C10.7521 8.86628 10.6891 8.7141 10.5769 8.6019C10.4647 8.4897 10.3125 8.42667 10.1539 8.42667Z" fill="#9AA0A6" />
      <path d="M10.1467 4.03231C10.2884 3.99455 10.4369 3.98985 10.5807 4.01858C10.7245 4.04731 10.8598 4.1087 10.9761 4.19802C11.0925 4.28733 11.1867 4.40218 11.2516 4.5337C11.3165 4.66522 11.3503 4.80989 11.3504 4.95655H6.56412L10.1467 4.03231Z" fill="#9AA0A6" />
    </svg>
  )
}