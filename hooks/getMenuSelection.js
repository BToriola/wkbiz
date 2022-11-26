import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const getMenuSelection = () => {
	const [menuSelection, setMenuSelection] = useState('');
	const router = useRouter();
	function checkUrlPathname() {
		const { pathname } = router;
		setMenuSelection(pathname);
	}
	useEffect(() => {
		checkUrlPathname();
	}, []);
	return [menuSelection];
};
export default getMenuSelection;
